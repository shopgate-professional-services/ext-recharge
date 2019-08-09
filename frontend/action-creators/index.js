import {
  REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
  RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
  REQUEST_RECHARGE_CART_TOKEN,
  RECEIVE_RECHARGE_CART_TOKEN,
  ERROR_RECHARGE_CART_TOKEN,
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
 * @param {string} productId product id used for fetching
 * @param {Object} products subscription products
 * @returns {Object}
 */
export const receiveRechargeSubscriptionItems = (productId, products) => ({
  type: RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  products,
  productId,
});

/**
 * Error recharge subscription items
 * @returns {Object}
 */
export const errorRechargeSubscriptionItems = () => ({
  type: ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
});

/**
 * Request recharge Cart Token action.
 * @returns {Object}
 */
export const requestRechargeCartToken = () => ({
  type: REQUEST_RECHARGE_CART_TOKEN,
});

/**
 * Receive r\echarge Cart Token action.
 * @param {string} rechargeCartToken recharge cart token
 * @returns {Object}
 */
export const receiveRechargeCartToken = rechargeCartToken => ({
  type: RECEIVE_RECHARGE_CART_TOKEN,
  rechargeCartToken,
});

/**
 * Error recharge Token action.
 * @returns {Object}
 */
export const errorRechargetCartToken = () => ({
  type: ERROR_RECHARGE_CART_TOKEN,
});
