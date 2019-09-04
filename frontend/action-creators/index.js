import {
  REQUEST_RECHARGE_SUBSCRIPTION_PRODUCTS,
  RECEIVE_RECHARGE_SUBSCRIPTION_PRODUCTS,
  ERROR_RECHARGE_SUBSCRIPTION_PRODUCTS,
  REQUEST_RECHARGE_CART,
  RECEIVE_RECHARGE_CART,
  ERROR_RECHARGE_CART,
  REQUEST_RECHARGE_CUSTOMER_HASH,
  RECEIVE_RECHARGE_CUSTOMER_HASH,
  ERROR_RECHARGE_CUSTOMER_HASH,
  REMOVE_RECHARGE_CUSTOMER_HASH,
  UPDATE_RECHARGE_INFO,
  UPDATE_SHOPIFY_VARIANT_ID,
} from '../constants';

/**
 * Request Recharge Subscription products
 * @param {string[]} productIds product ids used for fetching
 * @returns {Object}
 */
export const requestRechargeSubscriptionProducts = productIds => ({
  type: REQUEST_RECHARGE_SUBSCRIPTION_PRODUCTS,
  productIds,
});

/**
 * Receive Recharge Subscription products
 * @param {string[]} productIds product ids used for fetching
 * @param {Object[]} products subscription products
 * @returns {Object}
 */
export const receiveRechargeSubscriptionProducts = (productIds, products) => ({
  type: RECEIVE_RECHARGE_SUBSCRIPTION_PRODUCTS,
  products,
  productIds,
});

/**
 * Error recharge subscription products
 * @param {string[]} productIds product ids used for fetching
 * @returns {Object}
 */
export const errorRechargeSubscriptionProducts = productIds => ({
  type: ERROR_RECHARGE_SUBSCRIPTION_PRODUCTS,
  productIds,
});

/**
 * Update Recharge Info
 * @param {string} baseProductId baseProductId
 * @param {Object} rechargeInfo recharge subcriptionInfo
 * @returns { Object }
 */
export const updateRechargeInfo = (baseProductId, rechargeInfo) => ({
  type: UPDATE_RECHARGE_INFO,
  baseProductId,
  rechargeInfo,
});

/**
 * Update Recharge Info
 * @param {string} baseProductId baseProductId
 * @param {string} shopifyVariantId shopify variant id to update
 * @returns { Object }
 */
export const updateShopifyVariantId = (baseProductId, shopifyVariantId) => ({
  type: UPDATE_SHOPIFY_VARIANT_ID,
  baseProductId,
  shopifyVariantId,
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
export const errorRechargeCart = () => ({
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
