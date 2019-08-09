import { createSelector } from 'reselect';
import { getBaseProductId, getProductById, getProductId, hasProductVariants } from '@shopgate/engage/product';
import { getIsFetching } from '@shopgate/engage/cart';
import parseJson from '../helpers/parseJson';
import {
  REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS,
  REDUX_NAMESPACE_RECHARGE_CART_TOKEN,
} from '../constants';

/**
 * @param {Object} state state
 * @return {Object}
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

/**
 * @param {Object} state state
 * @return {Object}
 */
export const getRechargeCartTokenState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_CART_TOKEN];

export const getRechargeCartToken = createSelector(
  getRechargeCartTokenState,
  ({ cartToken }) => cartToken
);

const isTokenFetching = createSelector(
  getRechargeCartTokenState,
  tokenState => tokenState.isFetching
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
