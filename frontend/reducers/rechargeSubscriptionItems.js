import {
  RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
  ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
} from '../constants';

import { PRODUCT_LIFETIME } from '@shopgate/engage/product';

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
          expires: 0,
        },
      };
    case RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS:
      return {
        ...state,
        [action.productId]: {
          subscriptionInfo: action.products,
          isFetching: false,
          expires: Date.now() + PRODUCT_LIFETIME,
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
