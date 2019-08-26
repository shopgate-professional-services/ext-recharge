/* eslint-disable camelcase */
import { createSelector } from 'reselect';
import {
  getBaseProductId,
  getProductById,
  getProductId,
  hasProductVariants,
} from '@shopgate/engage/product';
import { getIsFetching, getCartItemById } from '@shopgate/engage/cart';
import { getDiscountToPrice } from '../helpers/rechargeDiscountPriceTools';
import parseJson from '../helpers/parseJson';
import {
  REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS,
  REDUX_NAMESPACE_RECHARGE_CART,
  REDUX_NAMESPACE_RECHARGE_CUSTOMER_HASH,
  REQUIRED_SUBSCRIPTION_TEXT,
  REDUX_NAMESPACE_RECHARGE_INFO,
  NO_SUBSCRIPTION_FREQUENCY_VALUE,
} from '../constants';

/**
 * @param {Object} state state
 * @returns {Object}
 */
export const getRechargeSubscriptionItemsState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS];

/**
 * Get Full ReCharge Subscription item
 * @param {Object} state Redux state,
 * @param {Object} props Component props
 * @return {Object|null}
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
 * @return {Object|null}
 */
export const getRechargeSubscriptionItems = createSelector(
  getReChargeFullSubscriptionItem,
  (fullSubscriptionItem) => {
    const { subscriptionInfo } = fullSubscriptionItem || {};

    return subscriptionInfo || null;
  }
);

export const isRechargeSubscriptionItemsFetching = createSelector(
  getRechargeSubscriptionItemsState,
  subscriptionItemsState => subscriptionItemsState.isFetching
);

export const getIsRechargeOptional = createSelector(
  getRechargeSubscriptionItems,
  (subscriptionInfo) => {
    if (!subscriptionInfo) {
      const isRechargeOptional = null;

      return isRechargeOptional;
    }

    const isRechargeOptional =
      subscriptionInfo.subscription_defaults.storefront_purchase_options || null;

    if (!isRechargeOptional) {
      return null;
    }

    return isRechargeOptional;
  }
);

/**
 *
 * @param {Object} state state
 * @returns {Object}
 */
export const getRechargeInfoState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_INFO];

export const getSelectedSubscriptionsInfo = createSelector(
  getRechargeInfoState,
  getBaseProductId,
  (recharge, baseProductId) => {
    const { rechargeInfo } = recharge[baseProductId] || {};
    return rechargeInfo || null;
  }
);

export const getCurrentlySelectedFrequency = createSelector(
  getRechargeInfoState,
  getBaseProductId,
  (recharge, baseProductId) => {
    const { currentlySelectedFrequency } = recharge[baseProductId] || {};
    return currentlySelectedFrequency || null;
  }
);

/**
 * Determine if product is subscription only
 * @param {Object} state Redux state,
 * @param {Object} props Component props
 * @return {boolean}
 */
export const getIsReChargeSubscriptionOnly = createSelector(
  getRechargeSubscriptionItems,
  (subscriptionInfo) => {
    if (!subscriptionInfo) {
      return false;
    }
    const {
      subscription_defaults: {
        storefront_purchase_options: storefrontPurchaseOption = null,
      },
    } = subscriptionInfo;

    return storefrontPurchaseOption === REQUIRED_SUBSCRIPTION_TEXT;
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

export const getRechargeSubtotalPrice = createSelector(
  getRechargeCartState,
  ({ subtotal_price }) => {
    if (!subtotal_price) {
      return null;
    }
    return parseFloat(subtotal_price);
  }
);

export const getRechargeTotalPrice = createSelector(
  getRechargeCartState,
  ({ total_price }) => {
    if (!total_price) {
      return null;
    }
    return parseFloat(total_price);
  }
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

/**
 * Get cart item quantity
 * @param {Object} state Redux state
 * @param {Object} props Component props
 * @return {Object|null}
 */
export const getCartItemQuantity = createSelector(
  getCartItemById,
  (cartItem) => {
    const { quantity = null } = cartItem || {};

    return quantity;
  }
);

/**
 * Get cart item product
 * @param {Object} state Redux state
 * @param {Object} props Component props
 * @return {Object|null}
 */
export const getCartItemProduct = createSelector(
  getCartItemById,
  (cartItem) => {
    const { product = null } = cartItem || {};

    return product;
  }
);

/**
 * Get cart item product's additional information
 * @param {Object} state Redux state
 * @param {Object} props Component props
 * @return {Object[]|null}
 */
export const getCartItemProductAdditionalInformation = createSelector(
  getCartItemProduct,
  (cartItemProduct) => {
    const { additionalInfo = null } = cartItemProduct || {};

    return additionalInfo;
  }
);

/**
 * Get cart item product's price
 * @param {Object} state Redux state
 * @param {Object} props Component props
 * @return {Object|null}
 */
export const getCartItemProductPrice = createSelector(
  getCartItemProduct,
  (cartItemProduct) => {
    const { price = null } = cartItemProduct || {};

    return price;
  }
);

/**
 * Get cart item product's price
 * @param {Object} state Redux state
 * @param {Object} props Component props
 * @return {Object|null}
 */
export const getCartItemProductUnitPrice = createSelector(
  getCartItemProductPrice,
  (priceObject) => {
    const { unit = 0 } = priceObject || {};

    return unit;
  }
);

/**
 * Get cart item product's recharge subscriptions
 * @param {Object} state Redux state
 * @param {Object} props Component props
 * @return {Object[]}
 */
export const getCartItemRechargeInfo = createSelector(
  getCartItemProductAdditionalInformation,
  (additionalInformation = []) => {
    const rechargeInfoContainer = additionalInformation
      .find(info => typeof info === 'object' && info.hasOwnProperty('recharge'));

    if (!rechargeInfoContainer) {
      return [];
    }
    const { recharge } = rechargeInfoContainer;
    return Array.isArray(recharge) ? recharge : [];
  }
);

/**
 * Get cart item product's price discounted recharge subscriptions
 * @param {Object} state Redux state
 * @param {Object} props Component props
 * @return {Object}
 */
export const getCartLineItemPriceDiscountedBySubscriptions = createSelector(
  getCartItemRechargeInfo,
  getCartItemProductPrice,
  getCartItemProductUnitPrice,
  (subscriptions, price, unitPrice) => {
    if (!subscriptions.length) {
      return price;
    }

    const totalSubscriptionDiscount = subscriptions
      .filter(subscription => (
        typeof subscription === 'object'
        && subscription.frequencyValue !== NO_SUBSCRIPTION_FREQUENCY_VALUE
        && typeof subscription.subscriptionInfo === 'object'
        && subscription.subscriptionInfo.discountAmount
        && subscription.subscriptionInfo.discountType
        && subscription.subscriptionInfo.quantity
      ))
      .map(({ subscriptionInfo: { discountAmount, discountType, quantity } }) => (
        getDiscountToPrice(unitPrice, discountType, discountAmount) * quantity
      ))
      .reduce((total, subscriptionDiscount) => total + subscriptionDiscount, 0);
    const { default: originalDefaultPrice, special: originalSpecialPrice } = price;
    const priceToBeCharged = originalSpecialPrice || originalDefaultPrice;

    if (!(totalSubscriptionDiscount && totalSubscriptionDiscount < priceToBeCharged)) {
      return price;
    }
    const subscriptionDiscountedPrice = priceToBeCharged - totalSubscriptionDiscount;

    return {
      unit: unitPrice,
      special: subscriptionDiscountedPrice,
      default: originalDefaultPrice,
    };
  }
);

