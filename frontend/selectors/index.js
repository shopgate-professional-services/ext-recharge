import { createSelector } from 'reselect';
import { REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS } from '../constants';

/**
 * @param {Object} state state
 * @return {Object}
 */
export const getRechargeSubscriptionItemsState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS];

export const getRechargeSubscriptionItems = createSelector(
  getRechargeSubscriptionItemsState,
  ({ product }) => product
);
