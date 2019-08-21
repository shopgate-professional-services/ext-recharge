import { productWillEnter$, getBaseProductId, receivedVisibleProduct$ } from '@shopgate/engage/product';
import { hex2bin } from '@shopgate/engage/core';
import { cartReceived$ } from '@shopgate/engage/cart';
import { userDataReceived$, userDidLogout$ } from '@shopgate/engage/user';
import { receiveFavorites$ } from '@shopgate/engage/favorites';
import { fetchSubscriptionProducts, fetchRechargeCart, addShopifyVariantId, fetchRechargeCustomerHash } from '../actions';
import { getVariantId } from '../selectors';
import { removeRechargeCustomerHash } from '../action-creators';

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
};
