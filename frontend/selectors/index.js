/* eslint-disable camelcase */
import { createSelector } from 'reselect';
import {
  getBaseProductId,
  getProductById,
  getProductId,
  hasProductVariants,
} from '@shopgate/engage/product';
import { getIsFetching, getCartItemById } from '@shopgate/engage/cart';
import {
  REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS,
  REDUX_NAMESPACE_RECHARGE_CART,
  REDUX_NAMESPACE_RECHARGE_CUSTOMER_HASH,
  REQUIRED_SUBSCRIPTION_TEXT,
  REDUX_NAMESPACE_RECHARGE_INFO,
} from '../constants';

/**
 * @param {Object} state state
 * @returns {Object}
 */
export const getRechargeSubscriptionItemsState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS];

/**
 * Get Full ReCharge Subscription item
 * @returns {Object|null}
 */
export const getReChargeFullSubscriptionItem = createSelector(
  getRechargeSubscriptionItemsState,
  getBaseProductId,
  (rechargeSubscriptionState, productId) => rechargeSubscriptionState[productId] || null
);

/**
 * Get ReCharge Subscription item
 * @returns {Object|null}
 */
export const getRechargeSubscriptionItems = createSelector(
  getReChargeFullSubscriptionItem,
  (fullSubscriptionItem) => {
    const { subscriptionInfo } = fullSubscriptionItem || {};

    return subscriptionInfo || null;
  }
);

/**
 * Get is fetching status of a product for recharge subscription information
 * @returns {bool}
 */
export const isRechargeSubscriptionItemsFetching = createSelector(
  getReChargeFullSubscriptionItem,
  fullSubscriptionItem => fullSubscriptionItem && fullSubscriptionItem.isFetching
);

/**
 * Get recharge info state to get discount information for pdp price
 * @param {Object} state state
 * @returns {Object}
 */
export const getRechargeInfoState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_INFO];

/**
 * Get subscription info for give productId
 * @returns {Object|| null}
 */
export const getSelectedSubscriptionsInfo = createSelector(
  getRechargeInfoState,
  getBaseProductId,
  (recharge, baseProductId) => {
    const { rechargeInfo } = recharge[baseProductId] || {};

    return rechargeInfo || null;
  }
);

/**
 * Determine if product is subscription only
 * @return {boolean}
 */
export const getIsRechargeSubscriptionOnly = createSelector(
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
 * Get cart item quantity
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
 * @param {Object} state state
 * @return {Object}
 */
export const getRechargeCartState = state =>
  state.extensions[REDUX_NAMESPACE_RECHARGE_CART];

/**
 * Gets recharge token from recharge cart reducer
 * @returns {string||null}
 */
export const getRechargeCartToken = createSelector(
  getRechargeCartState,
  ({ token }) => token || null
);

/**
 * Gets subtotal price from recharge cart reducer
 * @returns {number||null}
 */
export const getRechargeSubtotalPrice = createSelector(
  getRechargeCartState,
  ({ subtotal_price }) => {
    if (!subtotal_price) {
      return null;
    }

    return parseFloat(subtotal_price);
  }
);

/**
 * Gets total price from recharge cart reducer
 * @returns {number||null}
 */
export const getRechargeTotalPrice = createSelector(
  getRechargeCartState,
  ({ total_price }) => {
    if (!total_price) {
      return null;
    }

    return parseFloat(total_price);
  }
);

/**
 * Gets line items from recharge cart reducer
 * @returns {Array||null}
 */
export const getRechargeCartLineItems = createSelector(
  getRechargeCartState,
  ({ line_items }) => {
    if (!line_items) {
      return null;
    }

    return line_items;
  }
);

export const getCartItemLineInfo = createSelector(
  getCartItemProduct,
  getRechargeCartLineItems,
  ({ id }, line_items) => {
    if (!line_items) {
      return [];
    }

    const rechargeInfo = line_items.filter(
      item => (item.product_id.toString() === id || item.variant_id.toString() === id)
    );

    return rechargeInfo;
  }
);

export const isTokenFetching = createSelector(
  getRechargeCartState,
  cartState => cartState.isFetching
);

export const getIsTokenErrored = createSelector(
  getRechargeCartState,
  cartState => cartState.isError
);

/**
 * Determine if cart is busty
 * @returns {bool}
 */
export const getIsCartBusy = createSelector(
  getIsFetching,
  isTokenFetching,
  (cartFetching, tokenFetching) => cartFetching || tokenFetching
);

/**
 * Get shopify variant id from custom data
 * @return {string}
 */
export const getShopifyVariant = createSelector(
  getProductById,
  (product) => {
    const { productData = {} } = product || {};
    /**
    * CustomData contains shopifyVariantId with getProducts pipeline
    * rechargeCustomData exposes customData after getProduct pipeline call.
    * rechargeCustomData needs a different name then customData
    * in case of additional need for customData exposure in separate extensions.
    */
    const customData = productData.customData || productData.rechargeCustomData;

    if (!customData) {
      return null;
    }

    const { variant_id: shopifyVariantId } = JSON.parse(customData) || {};

    return shopifyVariantId ? `${shopifyVariantId}` : null;
  }
);

/**
 * Get Variant Id
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
 * @return {string}
 */
export const getRechargeCustomerHash = createSelector(
  getRechargeCustomerHashState,
  customerHashState => customerHashState.customerHash
);

/**
 * Get cart item product's price
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
 * Get cart item product's price discounted recharge subscriptions
 * @return {Object}
 */
export const getCartLineItemPriceDiscountedBySubscriptions = createSelector(
  getCartItemLineInfo,
  getCartItemProductPrice,
  getCartItemProductUnitPrice,
  (rechargeInfo, price, unitPrice) => {
    if (!rechargeInfo.length) {
      return price;
    }

    const totalRechargeLinePrice = rechargeInfo
      .map(info => (parseFloat(info.price) * parseInt(info.quantity, 10)))
      .reduce((total, rechargePrice) => total + rechargePrice, 0);

    const { default: originalDefaultPrice, special: originalSpecialPrice } = price;
    const priceToBeCharged = originalSpecialPrice || originalDefaultPrice;

    if (!(totalRechargeLinePrice < priceToBeCharged)) {
      return price;
    }

    return {
      unit: unitPrice,
      special: totalRechargeLinePrice,
      default: originalDefaultPrice,
    };
  }
);
