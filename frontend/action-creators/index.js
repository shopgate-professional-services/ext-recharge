import {
  REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
  RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
  REQUEST_RECHARGE_CART,
  RECEIVE_RECHARGE_CART,
  ERROR_RECHARGE_CART,
  REQUEST_RECHARGE_CUSTOMER_HASH,
  RECEIVE_RECHARGE_CUSTOMER_HASH,
  ERROR_RECHARGE_CUSTOMER_HASH,
  REMOVE_RECHARGE_CUSTOMER_HASH,
  UPDATE_RECHARGE_INFO,
} from '../constants';

/**
 * Request Recharge Subscription Items
 * @param {string[]} productIds product ids used for fetching
 * @returns {Object}
 */
export const requestRechargeSubscriptionItems = productIds => ({
  type: REQUEST_RECHARGE_SUBSCRIPTION_ITEMS,
  productIds,
});

/**
 * Receive Recharge Subscription Items
 * @param {string[]} productIds product ids used for fetching
 * @param {Object[]} products subscription products
 * @returns {Object}
 */
export const receiveRechargeSubscriptionItems = (productIds, products) => ({
  type: RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS,
  products,
  productIds,
});

/**
 * Error recharge subscription items
 * @returns {Object}
 */
export const errorRechargeSubscriptionItems = () => ({
  type: ERROR_RECHARGE_SUBSCRIPTION_ITEMS,
});

/**
 * Update Recharge Info
 * @param {string} productId productId
 * @param {Object} rechargeInfo recharge subcriptionInfo
 * @returns { Object }
 */
export const updateRechargeInfo = (productId, rechargeInfo) => ({
  type: UPDATE_RECHARGE_INFO,
  productId,
  rechargeInfo,
});

/**
 * Request recharge Cart Token action.
 * @returns {Object}
 */
export const requestRechargeCart = () => ({
  type: REQUEST_RECHARGE_CART,
});

/**
 * Receive recharge Cart Token action.
 * @param {string} rechargeCart recharge cart
 * @returns {Object}
 */
export const receiveRechargeCart = rechargeCart => ({
  type: RECEIVE_RECHARGE_CART,
  rechargeCart,
});

/**
 * Error recharge Token action.
 * @returns {Object}
 */
export const errorRechargetCart = () => ({
  type: ERROR_RECHARGE_CART,
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
