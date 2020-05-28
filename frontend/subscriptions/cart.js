import { appDidStart$, mutableActions } from '@shopgate/engage/core';
import { addProductsToCart, getAddToCartOptions } from '@shopgate/engage/cart';
import { getBaseProductId } from '@shopgate/engage/product';
import { getSelectedSubscriptionsInfo, getVariantId } from '../selectors';

/**
 * @param {Function} subscribe subscribe
 */
export default (subscribe) => {
  subscribe(appDidStart$, async ({ getState }) => {
    addProductsToCart.useBefore(addProductsData => (
      mutableActions.next(addProductsData.map((data) => {
        if (data.metadata && data.metadata.shopifyVariantId) {
          // Already processed by addProductToCart
          return data;
        }

        const state = getState();

        // Transform the options to the required format for the pipeline request.
        const options = getAddToCartOptions(state, data);
        const { productId } = data;

        const baseProductId = getBaseProductId(state, {
          variantId: productId,
          productId,
        });

        const rechargeInfo = getSelectedSubscriptionsInfo(state, {
          baseProductId,
          variantId: productId,
        });
        const shopifyVariantId = getVariantId(state, { productId });

        return {
          ...data,
          ...(options) && { options },
          metadata: {
            ...data.metadata,
            rechargeInfo,
            shopifyVariantId,
            baseProductId,
          },
        };
      }))
    ));
  });
};
