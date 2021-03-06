import { getBaseProductId, receivedVisibleProduct$ } from '@shopgate/engage/product';
import {
  cartReceived$,
  fetchCart,
  cartWillEnter$,
  cartUpdatedWhileVisible$,
  productsAdded$,
  productsUpdated$,
} from '@shopgate/engage/cart';
import { PipelineRequest, logger } from '@shopgate/engage/core';
import { navigate$ } from '@shopgate/pwa-common/streams/router';
import getCart from '@shopgate/pwa-tracking/selectors/cart';
import { checkoutSucceeded$ } from '@shopgate/engage/checkout';
import { track } from '@shopgate/pwa-tracking/helpers';
import { userDataReceived$, userDidLogout$ } from '@shopgate/engage/user';
import { receiveFavorites$ } from '@shopgate/engage/favorites';
import {
  fetchSubscriptionProducts,
  fetchRechargeCart,
  fetchRechargeCustomerHash,
  setBlockRechargeCart,
  createWebhook,
} from '../actions';
import { removeRechargeCustomerHash } from '../action-creators';
import { RECHARGE_CHECKOUT_PATH } from '../constants';
import cartSubscriptions from './cart';

export default (subscribe) => {
  cartSubscriptions(subscribe);

  subscribe(receivedVisibleProduct$, ({ action, dispatch, getState }) => {
    const state = getState();
    const { productData } = action;

    const baseProductId = getBaseProductId(state, {
      variantId: productData.id,
      productId: productData.id,
    });

    // Fetch recharge subscription options
    dispatch(fetchSubscriptionProducts([baseProductId]));
  });

  const rechargeCartNeedsSync$ = cartWillEnter$.merge(cartUpdatedWhileVisible$);

  subscribe(rechargeCartNeedsSync$, ({ dispatch }) => {
    dispatch(fetchRechargeCart());
  });

  // If user logged in then we should fetch recharge customer hash
  subscribe(userDataReceived$, ({ dispatch }) => {
    dispatch(fetchRechargeCustomerHash());
  });

  // Remove recharge customer hash
  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(removeRechargeCustomerHash());
  });

  // Determine if products added have subscription options
  subscribe(receiveFavorites$, ({ action, dispatch }) => {
    const { products } = action || {};
    const productIds = products.map(product => product.baseProductId || product.id);

    dispatch(fetchSubscriptionProducts(productIds));
  });

  const checkoutDidEnter$ = navigate$
    .filter(({ action }) =>
      action.params.pathname && action.params.pathname.includes(RECHARGE_CHECKOUT_PATH));

  subscribe(checkoutDidEnter$, ({ getState }) => {
    const state = getState();

    track('initiatedCheckout', { cart: getCart(state) }, state);
  });

  let cartNeedsSync = false;

  subscribe(checkoutSucceeded$, ({ dispatch }) => {
    cartNeedsSync = true;
    dispatch(createWebhook());
  });

  subscribe(cartReceived$, ({ action, dispatch }) => {
    const { cartItems = {} } = action.cart || {};

    if (!cartItems.length) {
      // We don't have to sync an empty cart
      cartNeedsSync = false;
      return;
    }

    if (cartNeedsSync) {
      cartNeedsSync = false;

      new PipelineRequest('shopgate.cart.fetchShopifyCheckout')
        .setInput({ createNew: true })
        .dispatch()
        .then(() => {
          dispatch(fetchRechargeCart());
          dispatch(fetchCart());
          dispatch(fetchRechargeCustomerHash());
        })
        .catch((error) => {
          logger.error(error);
        });
    }
  });

  subscribe(productsAdded$, ({ dispatch }) => {
    dispatch(setBlockRechargeCart(true));
  });

  subscribe(productsUpdated$, ({ dispatch }) => {
    dispatch(setBlockRechargeCart(false));
  });
};
