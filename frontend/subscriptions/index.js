import { productWillEnter$, getBaseProductId, receivedVisibleProduct$ } from '@shopgate/engage/product';
import { cartReceived$, cartUpdateFailed$, fetchCart } from '@shopgate/engage/cart';
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
  rechargeErrorAddProductsToCart,
} from '../actions';
import { getVariantId } from '../selectors';
import { removeRechargeCustomerHash } from '../action-creators';
import { RECHARGE_CHECKOUT_PATH } from '../constants';

export default (subscribe) => {
  subscribe(productWillEnter$, ({ action, dispatch, getState }) => {
    const { productId } = action.route.params;
    const { productId: variantId } = action.route.state;

    const baseProductId = getBaseProductId(getState(), {
      variantId, productId: hex2bin(productId),
    });

    dispatch(fetchSubscriptionProducts([baseProductId]));
  });

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

  subscribe(cartReceived$, ({ dispatch }) => {
    dispatch(fetchRechargeCart());
  });

  subscribe(userDataReceived$, ({ dispatch }) => {
    dispatch(fetchRechargeCustomerHash());
  });

  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(removeRechargeCustomerHash());
  });

  subscribe(receiveFavorites$, ({ action, dispatch }) => {
    const { products } = action || {};
    const productIds = products.map(product => product.baseProductId || product.id);
    dispatch(fetchSubscriptionProducts(productIds));
  });

  subscribe(cartUpdateFailed$, ({ action, dispatch }) => {
    const { products } = action;
    dispatch(rechargeErrorAddProductsToCart(products));
  });

  const checkoutDidEnter$ = navigate$
    .filter(({ action }) => action.params.pathname && action.params.pathname.includes(RECHARGE_CHECKOUT_PATH));

  subscribe(checkoutDidEnter$, ({ getState }) => {
    const state = getState();

    track('initiatedCheckout', { cart: getCart(state) }, state);
  });

  subscribe(checkoutSucceeded$, ({ dispatch }) => {
    // Create a new cart
    new PipelineRequest('shopgate.cart.fetchShopifyCheckout')
      .setInput({ createNew: true })
      .dispatch()
      .then(() => {
        // tODO: ticket request handling
        // tODO: ticket fetchCart return request

        dispatch(fetchRechargeCart());
      })
      .catch((error) => {
        logger.error(error);
      });
  });
};
