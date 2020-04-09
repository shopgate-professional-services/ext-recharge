import {
  RECEIVE_RECHARGE_CART,
  REQUEST_RECHARGE_CART,
  ERROR_RECHARGE_CART,
  SET_BLOCK_RECHARGE_CART,
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
    isBlocked: false,
    isError: null,
  },
  action
) => {
  switch (action.type) {
    case REQUEST_RECHARGE_CART:
      return {
        ...state,
        isFetching: true,
        isBlocked: false,
      };
    case RECEIVE_RECHARGE_CART:
      return {
        ...action.rechargeCart,
        isFetching: false,
        isBlocked: false,
        isError: false,
      };
    case ERROR_RECHARGE_CART:
      return {
        ...state,
        isFetching: false,
        isBlocked: false,
        isError: true,
      };
    case SET_BLOCK_RECHARGE_CART:
      return {
        ...state,
        isFetching: false,
        isBlocked: action.flag,
      };
    default:
      return state;
  }
};

export default rechargeCartReducer;
