import { UPDATE_RECHARGE_INFO } from '../constants';

/**
 * Recharge Info Reducer
 * @param {Object} state state
 * @param {Object} action action
 * @returns {Object}
 */
const rechargeInfoReducer = (
  state = {
    isFetching: false,
  },
  action
) => {
  switch (action.type) {
    case UPDATE_RECHARGE_INFO:
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

export default rechargeInfoReducer;
