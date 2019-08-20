import { createSelector } from 'reselect';
import { getBaseProductId, getProductById, getProductId, hasProductVariants } from '@shopgate/engage/product';
import { getIsFetching } from '@shopgate/engage/cart';
import parseJson from '../helpers/parseJson';
import {
  REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS,
  REDUX_NAMESPACE_RECHARGE_CART,
  REDUX_NAMESPACE_RECHARGE_CUSTOMER_HASH,
  REDUX_NAMESPACE_RECHARGE_PDP_INFO,
} from '../constants';

/**
 * @param {Object} state state
 * @returns {Object}
 */
export const getRechargeSubscriptionItemsState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS];

export const getRechargeSubscriptionItems = createSelector(
  getRechargeSubscriptionItemsState,
  getBaseProductId,
  (subscriptionItems, baseProductId) => {
    const { subscriptionInfo } = subscriptionItems[baseProductId] || {};

    return subscriptionInfo || null;
  }
);

export const getIsRechargeOptional = createSelector(
  getRechargeSubscriptionItems,
  (subscriptionInfo) => {
    if (!subscriptionInfo) {
      const isRechargeOptional = null;

      return isRechargeOptional;
    }

    const isRechargeOptional = subscriptionInfo.find(arr => arr.subscription_defaults);

    if (!isRechargeOptional) {
      return null;
    }

    return isRechargeOptional.subscription_defaults.storefront_purchase_options;
  }
);

/**
 *
 * @param {Object} state state
 * @returns {Object}
 */
export const getRechargePDPInfoState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_PDP_INFO];

export const getSelectedSubscriptionsInfo = createSelector(
  getRechargePDPInfoState,
  getBaseProductId,
  (rechargePDPInfo, baseProductId) => {
    const { rechargeInfo } = rechargePDPInfo[baseProductId] || {};
    return rechargeInfo || null;
  }
);

export const getCurrentlySelectedFrequency = createSelector(
  getRechargePDPInfoState,
  getBaseProductId,
  (rechargePDPInfo, baseProductId) => {
    const { currentlySelectedFrequency } = rechargePDPInfo[baseProductId] || {};
    return currentlySelectedFrequency || null;
  }
);

/**
 * @param {Object} state state
 * @return {Object}
 */
export const getRechargeCartState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_CART];

export const getRechargeCartToken = createSelector(
  getRechargeCartState,
  ({ token }) => token || null
);

const isTokenFetching = createSelector(
  getRechargeCartState,
  cartState => cartState.isFetching
);

export const getIsCartBusy = createSelector(
  getIsFetching,
  isTokenFetching,
  (cartFetching, tokenFetching) => cartFetching || tokenFetching
);

/**
 * Get shopify variant id from custom data
 * @param {Object} state Redux state,
 * @param {Object} props Component props
 * @return {string}
 */
export const getShopifyVariant = createSelector(
  getProductById,
  (product) => {
    const { productData } = product || {};
    const { customData } = productData || {};
    const customDataObject = parseJson(customData);
    const { variant_id: shopifyVariantId } = customDataObject || {};

    return shopifyVariantId ? `${shopifyVariantId}` : null;
  }
);

/**
 * Get Variant Id
 * @param {Object} state Redux state,
 * @param {Object} props Component props
 * @return {string}
 */
export const getVariantId = createSelector(
  getProductId,
  hasProductVariants,
  getShopifyVariant,
  (productId, hasVariants, shopifyVariant) => {
    if (shopifyVariant && !hasVariants) {
      return shopifyVariant;
    }

    return productId;
  }
);

/**
 * Get Recharge Customer Hash State
 * @param {Object} state Redux state
 * @return {Object}
 */
export const getRechargeCustomerHashState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_CUSTOMER_HASH];

/**
 * Get recharge customer hash
 * @param {Object} state Redux state,
 * @return {string}
 */
export const getRechargeCustomerHash = createSelector(
  getRechargeCustomerHashState,
  customerHashState => customerHashState.customerHash
);
