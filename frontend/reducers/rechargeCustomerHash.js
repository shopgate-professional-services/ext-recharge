import {
  REQUEST_RECHARGE_CUSTOMER_HASH,
  RECEIVE_RECHARGE_CUSTOMER_HASH,
  ERROR_RECHARGE_CUSTOMER_HASH,
  REMOVE_RECHARGE_CUSTOMER_HASH,
} from '../constants';

/**
 * Bolt Cart Token Reducer
 * @param {Object} state State.
 * @param {Object} action Action.
 * @returns {Object}
 */
const rechargeCustomerHashReducer = (
  state = {
    customerHash: null,
    isFetching: false,
  },
  action
) => {
  switch (action.type) {
    case REQUEST_RECHARGE_CUSTOMER_HASH:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_RECHARGE_CUSTOMER_HASH:
      return {
        ...state,
        customerHash: action.customerHash,
        isFetching: false,
      };
    case ERROR_RECHARGE_CUSTOMER_HASH:
      return {
        ...state,
        isFetching: false,
      };
    case REMOVE_RECHARGE_CUSTOMER_HASH:
      return {
        ...state,
        customerHash: null,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default rechargeCustomerHashReducer;
