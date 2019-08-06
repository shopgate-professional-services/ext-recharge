import { productWillEnter$, getBaseProductId } from '@shopgate/engage/product';
import { hex2bin } from '@shopgate/engage/core';
import { fetchSubscriptionProducts } from '../actions';

export default (subscribe) => {
  subscribe(productWillEnter$, ({ action, dispatch, getState }) => {
    const { productId } = action.route.params;
    const { productId: variantId } = action.route.state;
    const baseProductId = getBaseProductId(getState(), {
      variantId, productId: hex2bin(productId),
    });
    dispatch(fetchSubscriptionProducts(baseProductId));
  });
};
