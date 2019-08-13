import { productWillEnter$, getBaseProductId, receivedVisibleProduct$ } from '@shopgate/engage/product';
import { hex2bin } from '@shopgate/engage/core';
import { cartReceived$ } from '@shopgate/engage/cart';
import { fetchSubscriptionProducts, fetchRechargeCartToken, addShopifyVariantId } from '../actions';
import { getVariantId } from '../selectors';

export default (subscribe) => {
  subscribe(productWillEnter$, ({ action, dispatch, getState }) => {
    const { productId } = action.route.params;
    const { productId: variantId } = action.route.state;

    const baseProductId = getBaseProductId(getState(), {
      variantId, productId: hex2bin(productId),
    });

    dispatch(fetchSubscriptionProducts(baseProductId));
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
    dispatch(fetchRechargeCartToken());
  });
};
