import { createSelector } from 'reselect';
import { getBaseProductId, getProductById, getProductId, hasProductVariants } from '@shopgate/engage/product';
import { getIsFetching } from '@shopgate/engage/cart';
import parseJson from '../helpers/parseJson';
import {
  REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS,
  REDUX_NAMESPACE_RECHARGE_CART,
  REDUX_NAMESPACE_RECHARGE_CUSTOMER_HASH,
} from '../constants';

/**
 * @param {Object} state state
 * @return {Object}
 */
export const getRechargeSubscriptionItemsState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS];

/**
 * Get Full ReCharge Subscription item
 * @param {Object} state Redux state,
 * @param {Object} props Component props
 * @return {string}
 */
export const getReChargeFullSubscriptionItem = createSelector(
  getRechargeSubscriptionItemsState,
  getBaseProductId,
  (rechargeSubscriptionState, productId) => rechargeSubscriptionState[productId] || null
);

/**
 * Get ReCharge Subscription item
 * @param {Object} state Redux state,
 * @param {Object} props Component props
 * @return {string}
 */
export const getRechargeSubscriptionItems = createSelector(
  getReChargeFullSubscriptionItem,
  (fullSubscriptionItem) => {
    const { subscriptionInfo } = fullSubscriptionItem || {};

    return subscriptionInfo || null;
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
