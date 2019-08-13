import {
  REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
  RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
  REQUEST_RECHARGE_CART_TOKEN,
  RECEIVE_RECHARGE_CART_TOKEN,
  ERROR_RECHARGE_CART_TOKEN,
  REQUEST_RECHARGE_CUSTOMER_HASH,
  RECEIVE_RECHARGE_CUSTOMER_HASH,
  ERROR_RECHARGE_CUSTOMER_HASH,
  REMOVE_RECHARGE_CUSTOMER_HASH,
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
 * Receive recharge Cart Token action.
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

/**
 * Request Recharge Customer Hash
 * @return {Object}
 */
export const requestRechargeCustomerHash = () => ({
  type: REQUEST_RECHARGE_CUSTOMER_HASH,
});

/**
 * Receive Recharge Customer Hash
 * @param {string} customerHash Recharge customer hash
 * @return {Object}
 */
export const receiveRechargeCustomerHash = customerHash => ({
  type: RECEIVE_RECHARGE_CUSTOMER_HASH,
  customerHash,
});

/**
 * Error receiving recharge customer hash
 * @return {Object}
 */
export const errorRechargeCustomerHash = () => ({
  type: ERROR_RECHARGE_CUSTOMER_HASH,
});

/**
 * Remove recharge customer hash
 * @return {Object}
 */
export const removeRechargeCustomerHash = () => ({
  type: REMOVE_RECHARGE_CUSTOMER_HASH,
});
