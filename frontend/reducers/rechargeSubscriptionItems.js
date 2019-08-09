import {
  RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
  ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
} from '../constants';

/**
 * Recharge Subscription Items Reducer
 * @param {Object} state state
 * @param {Object} action action
 * @returns {Object}
 */
const rechargeSubscriptionItemsReducer = (
  state = {
  },
  action
) => {
  switch (action.type) {
    case REQUEST_RECHARGE_SUBSCRIPTION_ITEMS:
      return {
        ...state,
        [action.productId]: {
          isFetching: true,
        },
      };
    case RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS:
      return {
        ...state,
        [action.productId]: {
          subscriptionInfo: action.products,
          isFetching: false,
        },
      };
    case ERROR_RECHARGE_SUBSCRIPTION_ITEMS:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default rechargeSubscriptionItemsReducer;
