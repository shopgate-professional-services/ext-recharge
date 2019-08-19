import {
  RECEIVE_RECHARGE_CART,
  REQUEST_RECHARGE_CART,
  ERROR_RECHARGE_CART,
} from '../constants';

/**
 * Recharge Cart Info Reducer
 * @param {Object} state State.
 * @param {Object} action Action.
 * @returns {Object}
 */
const rechargeCartReducer = (
  state = {
    rechargeCart: null,
    isFetching: false,
  },
  action
) => {
  switch (action.type) {
    case REQUEST_RECHARGE_CART:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_RECHARGE_CART:
      return {
        ...action.rechargeCart,
        isFetching: false,
      };
    case ERROR_RECHARGE_CART:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default rechargeCartReducer;
