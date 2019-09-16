import { UPDATE_RECHARGE_INFO, UPDATE_SHOPIFY_VARIANT_ID } from '../constants';

/**
 * Recharge Info Reducer
 * @param {Object} state state
 * @param {Object} action action
 * @returns {Object}
 */
const rechargeInfoReducer = (
  state = {},
  action
) => {
  switch (action.type) {
    case UPDATE_RECHARGE_INFO:
      return {
        ...state,
        [action.baseProductId]: {
          rechargeInfo: action.rechargeInfo,
          isFetching: false,
        },
      };
    case UPDATE_SHOPIFY_VARIANT_ID:
      return {
        ...state,
        [action.baseProductId]: {
          rechargeInfo: {
            ...state[action.baseProductId].rechargeInfo,
            subscriptionInfo: {
              ...state[action.baseProductId].rechargeInfo.subscriptionInfo,
              shopifyVariantId: action.shopifyVariantId,
            },
          },
        },
      };
    default:
      return state;
  }
};

export default rechargeInfoReducer;
