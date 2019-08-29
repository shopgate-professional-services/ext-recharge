import { productWillEnter$, getBaseProductId, receivedVisibleProduct$ } from '@shopgate/engage/product';
import { cartReceived$, fetchCart } from '@shopgate/engage/cart';
import { hex2bin, PipelineRequest, logger } from '@shopgate/engage/core';
import { navigate$ } from '@shopgate/pwa-common/streams/router';
import getCart from '@shopgate/pwa-tracking/selectors/cart';
import { checkoutSucceeded$ } from '@shopgate/pwa-common-commerce/checkout';
import { track } from '@shopgate/pwa-tracking/helpers';
import { userDataReceived$, userDidLogout$ } from '@shopgate/engage/user';
import { receiveFavorites$ } from '@shopgate/engage/favorites';
import {
  fetchSubscriptionProducts,
  fetchRechargeCart,
  addShopifyVariantId,
  fetchRechargeCustomerHash,
} from '../actions';
import { getVariantId } from '../selectors';
import { removeRechargeCustomerHash } from '../action-creators';
import { RECHARGE_CHECKOUT_PATH } from '../constants';

export default (subscribe) => {
  // Fetch recharge subscription options when product info is ready
  subscribe(productWillEnter$, ({ action, dispatch, getState }) => {
    const { productId } = action.route.params;
    const { productId: variantId } = action.route.state;

    const baseProductId = getBaseProductId(getState(), {
      variantId, productId: hex2bin(productId),
    });

    dispatch(fetchSubscriptionProducts([baseProductId]));
  });

  // Adds Shopify variant_id on product entry
  subscribe(receivedVisibleProduct$, ({ action, dispatch, getState }) => {
    const productId = action.productData.id;
    const customData = JSON.parse(action.productData.customData);

    if (customData.variantId) {
      const shopifyVariantId = customData.variant_id;
      dispatch(addShopifyVariantId(productId, shopifyVariantId));
      return;
    }

    const shopifyVariantId = getVariantId(getState(), { productId });
    dispatch(addShopifyVariantId(productId, shopifyVariantId));
  });

  // Check if we can fetch recharge cart with received cart items.
  subscribe(cartReceived$, ({ dispatch }) => {
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

  subscribe(checkoutSucceeded$, () => {
    cartNeedsSync = true;
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
          // tODO: ticket request handling
          // tODO: ticket fetchCart return request
          dispatch(fetchRechargeCart());
          dispatch(fetchCart());
        })
        .catch((error) => {
          logger.error(error);
        });
    }
  });
};
