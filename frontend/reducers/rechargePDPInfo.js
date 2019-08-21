import {
  RECEIVE_RECHARGE_PDP_INFO,
  REQUEST_RECHARGE_PDP_INFO,
  ERROR_RECHARGE_PDP_INFO,
  UPDATE_RECHARGE_PDP_INFO,
} from '../constants';

/**
 * Recharge PDP Info Reducer
 * @param {Object} state state
 * @param {Object} action action
 * @returns {Object}
 */
const rechargePDPInfoReducer = (
  state = {
    isFetching: false,
  },
  action
) => {
  switch (action.type) {
    case REQUEST_RECHARGE_PDP_INFO:
      return {
        ...state,
        [action.productId]: {
          isFetching: true,
        },
      };
    case RECEIVE_RECHARGE_PDP_INFO:
      return {
        ...state,
        [action.productId]: {
          isFetching: false,
        },
      };
    case ERROR_RECHARGE_PDP_INFO:
      return {
        ...state,
        [action.productId]: {
          isFetching: false,
        },
      };
    case UPDATE_RECHARGE_PDP_INFO:
      return {
        ...state,
        [action.productId]: {
          currentlySelectedFrequency: action.currentlySelectedFrequency,
          rechargeInfo: action.rechargeInfo,
          isFetching: false,
        },
      };
    default:
      return state;
  }
};

export default rechargePDPInfoReducer;
