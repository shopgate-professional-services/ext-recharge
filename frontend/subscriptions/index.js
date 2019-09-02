import { getBaseProductId, receivedVisibleProduct$ } from '@shopgate/engage/product';
import { cartReceived$, fetchCart } from '@shopgate/engage/cart';
import { PipelineRequest, logger } from '@shopgate/engage/core';
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
  subscribe(receivedVisibleProduct$, ({ action, dispatch, getState }) => {
    const state = getState();
    const { productData } = action;

    const baseProductId = getBaseProductId(state, {
      variantId: productData.id,
      productId: productData.id,
    });

    // Fetch recharge subscription options
    dispatch(fetchSubscriptionProducts([baseProductId]));

    // Adds Shopify variant_id and baseProductId to product meta data on product entry so it is
    // available to build the recharge mirror cart on add to cart
    const productId = productData.id;
    const customData = JSON.parse(productData.customData); // this should happen already in the backend
    const shopifyVariantId = customData.variant_id ? `${customData.variant_id}` : productId;
    const resolvedBaseProductId = baseProductId || productId;

    dispatch(addShopifyVariantId(productId, shopifyVariantId, resolvedBaseProductId));
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
          dispatch(fetchRechargeCart());
          dispatch(fetchCart());
        })
        .catch((error) => {
          logger.error(error);
        });
    }
  });
};
