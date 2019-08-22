import { PRODUCT_LIFETIME } from '@shopgate/engage/product';
import {
  RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
  ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
} from '../constants';
import handleReChargeProducts from './helpers/handleReChargeProducts';

/**
 * Recharge Subscription Items Reducer
 * @param {Object} state state
 * @param {Object} action action
 * @returns {Object}
 */
const rechargeSubscriptionItemsReducer = (
  state = {
    isFetching: false,
  },
  action
) => {
  switch (action.type) {
    case REQUEST_RECHARGE_SUBSCRIPTION_ITEMS:
      return {
        ...state,
        ...action.productIds.reduce((collectedProducts, productId) => ({
          ...collectedProducts,
          [productId]: {
            expires: Date.now() + PRODUCT_LIFETIME,
          },
        }), {}),
        isFetching: true,
      };
    case RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS:
      return {
        ...state,
        ...handleReChargeProducts(action.productIds, action.products),
        isFetching: false,
      };
    case ERROR_RECHARGE_SUBSCRIPTION_ITEMS:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default rechargeSubscriptionItemsReducer;
