import { productWillEnter$, getBaseProductId } from '@shopgate/engage/product';
import { hex2bin } from '@shopgate/engage/core';
import { cartReceived$ } from '@shopgate/engage/cart';
import { userDataReceived$, userDidLogout$ } from '@shopgate/engage/user';
import {
  fetchSubscriptionProducts,
  fetchRechargeCartToken,
  fetchRechargeCustomerHash,
} from '../actions';
import { removeRechargeCustomerHash } from '../action-creators';

export default (subscribe) => {
  subscribe(productWillEnter$, ({ action, dispatch, getState }) => {
    const { productId } = action.route.params;
    const { productId: variantId } = action.route.state;

    const baseProductId = getBaseProductId(getState(), {
      variantId, productId: hex2bin(productId),
    });

    dispatch(fetchSubscriptionProducts(baseProductId));
  });

  subscribe(cartReceived$, ({ action, dispatch }) => {
    const { recharge } = action.cart.cartItems[0].product.additionalInfo[1].rechargeInfo || {};
    console.warn(recharge);
    dispatch(fetchRechargeCartToken(recharge));
  });

  subscribe(userDataReceived$, ({ dispatch }) => {
    dispatch(fetchRechargeCustomerHash());
  });

  subscribe(userDidLogout$, ({ dispatch }) => {
    dispatch(removeRechargeCustomerHash());
  });
};
