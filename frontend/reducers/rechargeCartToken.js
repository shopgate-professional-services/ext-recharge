import {
  RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  REQUEST_RECHARGE_CART_TOKEN,
  ERROR_RECHARGE_CART_TOKEN,
} from '../constants';

/**
 * Bolt Cart Token Reducer
 * @param {Object} state State.
 * @param {Object} action Action.
 * @returns {Object}
 */
const rechargeTokenReducer = (
  state = {
    cartToken: null,
    isFetching: false,
  },
  action
) => {
  switch (action.type) {
    case REQUEST_RECHARGE_CART_TOKEN:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS:
      return {
        ...action.rechargeCartToken,
        isFetching: false,
      };
    case ERROR_RECHARGE_CART_TOKEN:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default rechargeTokenReducer;
