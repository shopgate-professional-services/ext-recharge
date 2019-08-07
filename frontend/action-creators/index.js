import {
  REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
  RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
} from '../constants';

/**
 * Request Recharge Subscription Items
 * @returns {Object}
 */
export const requestRechargeSubscriptionItems = () => ({
  type: REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
});

/**
 * Receive Recharge Subscription Items
 * @param {Object} products subscription products
 * @returns {Object}
 */
export const receiveRechargeSubscriptionItems = products => ({
  type: RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  products,
});

/**
 * Error recharge subscription items
 * @returns {Object}
 */
export const errorRechargeSubscriptionItems = () => ({
  type: ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
});
