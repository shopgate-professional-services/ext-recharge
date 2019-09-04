import {
  RECEIVE_RECHARGE_SUBSCRIPTION_PRODUCTS,
  REQUEST_RECHARGE_SUBSCRIPTION_PRODUCTS,
  ERROR_RECHARGE_SUBSCRIPTION_PRODUCTS,
} from '../constants';
import handleReChargeProducts from './helpers/handleReChargeProducts';

/**
 * Recharge Subscription Items Reducer
 * @param {Object} state state
 * @param {Object} action action
 * @returns {Object}
 */
const rechargeSubscriptionItemsReducer = (
  state = {},
  action
) => {
  switch (action.type) {
    case REQUEST_RECHARGE_SUBSCRIPTION_PRODUCTS:
      return {
        ...state,
        ...action.productIds.reduce((collectedProducts, productId) => ({
          ...collectedProducts,
          [productId]: {
            isFetching: true,
          },
        }), {}),
      };
    case RECEIVE_RECHARGE_SUBSCRIPTION_PRODUCTS:
      return {
        ...state,
        ...handleReChargeProducts(action.productIds, action.products),
      };
    case ERROR_RECHARGE_SUBSCRIPTION_PRODUCTS:
      return {
        ...state,
        ...action.productIds.reduce((collectedProducts, productId) => ({
          ...collectedProducts,
          [productId]: {
            isFetching: false,
          },
        }), {}),
      };
    default:
      return state;
  }
};

export default rechargeSubscriptionItemsReducer;
