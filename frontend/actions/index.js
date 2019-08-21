import { PipelineRequest, LoadingProvider, logger } from '@shopgate/engage/core';
import updateMetaData from '@shopgate/pwa-common-commerce/product/actions/updateMetadata';
import { CART_PATH } from '@shopgate/engage/cart';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import {
  getRechargeSubscriptionItemsState,
  getRechargeCartState,
  getVariantId,
} from '../selectors';
import { GET_SUBSCRIPTION_PRODUCTS, CREATE_CHECKOUT, GET_CUSTOMER_HASH, RECHARGE_ERROR_ADD_PRODUCTS_TO_CART } from '../constants';
import {
  receiveRechargeSubscriptionItems,
  requestRechargeSubscriptionItems,
  errorRechargeSubscriptionItems,
  requestRechargePdpInfo,
  receiveRechargePdpInfo,
  errorRechargePdpInfo,
  updateRechargePdpInfo,
  receiveRechargeCart,
  requestRechargeCart,
  errorRechargetCart,
  requestRechargeCustomerHash,
  receiveRechargeCustomerHash,
  errorRechargeCustomerHash,
} from '../action-creators';

/**
 * @param {string} productId productId
 * @param {string} currentlySelectedFrequency currently selected frequency
 * @param {Object} rechargeInfo recharge info
 * @returns {Function}
 */
export const updateRechargePDPInfoReducer = (productId, currentlySelectedFrequency, rechargeInfo) =>
  (dispatch) => {
    const metaData = {
      currentlySelectedFrequency,
      rechargeInfo,
    };

    dispatch(updateMetaData(productId, metaData));
    dispatch(updateRechargePdpInfo(productId, currentlySelectedFrequency, rechargeInfo));
  };

/**
 * Fetches subscription product information
 * @param {string[]} productIds product ids used to fetch subscription
 * @returns {Function}
 */
export const fetchSubscriptionProducts = (productIds = []) => (dispatch) => {
  // todo check state to find products that are not already cashed before fetching
  dispatch(requestRechargeSubscriptionItems(productIds));

  new PipelineRequest(GET_SUBSCRIPTION_PRODUCTS)
    .setInput({ productIds })
    .dispatch()
    .then(({ products }) => {
      dispatch(receiveRechargeSubscriptionItems(productIds, products));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorRechargeSubscriptionItems);
    });
};

/**
 * @returns {Function}
 */
export const fetchRechargeCart = () => (dispatch, getState) => {
  const state = getState();
  const rechargeCartState = getRechargeCartState(state);

  if (rechargeCartState.isFetching) {
    return;
  }

  LoadingProvider.setLoading(CART_PATH);

  dispatch(requestRechargeCart());
  new PipelineRequest(CREATE_CHECKOUT)
    .setHandleErrors(ERROR_HANDLE_SUPPRESS)
    .dispatch()
    .then((response) => {
      dispatch(receiveRechargeCart(response.rechargeCart));
      LoadingProvider.unsetLoading(CART_PATH);
    })
    .catch((err) => {
      logger.error(err);
      dispatch(errorRechargetCart());
      LoadingProvider.unsetLoading(CART_PATH);
    });
};

/**
 * @param {string} productId productId
 * @param {string} shopifyVariantId variantId
 * @returns {Function}
 */
export const addShopifyVariantId = (productId, shopifyVariantId) => (dispatch) => {
  const metaData = {
    shopifyVariantId,
  };

  dispatch(updateMetaData(productId, metaData));
};
/**
 * Fetch recharge customer hash
 * @return {Function}
 */
export const fetchRechargeCustomerHash = () => (dispatch) => {
  dispatch(requestRechargeCustomerHash());

  return new PipelineRequest(GET_CUSTOMER_HASH)
    .setHandleErrors(ERROR_HANDLE_SUPPRESS)
    .dispatch()
    .then((response) => {
      const { customerHash } = response || {};
      dispatch(receiveRechargeCustomerHash(customerHash));
    })
    .catch((err) => {
      logger.error(err);
      dispatch(errorRechargeCustomerHash());
    });
};

/**
 * Corrects reducer information for recharge subscription quantity
 * @param {Array} products products
 * @returns {Function}
 */
export const rechargeErrorAddProductsToCart = products => (dispatch) => {
  dispatch({
    type: RECHARGE_ERROR_ADD_PRODUCTS_TO_CART,
    products,
  });
  const { productId } = products[0];
  const { rechargeInfo, currentlySelectedFrequency } = products[0].metadata;

  if (currentlySelectedFrequency) {
    const index = rechargeInfo.findIndex(val =>
      val.frequencyValue === currentlySelectedFrequency);

    const selectedSubscriptionInfo = rechargeInfo.splice(index, 1);

    const toDecrement = selectedSubscriptionInfo[0].subscriptionInfo.quantity - 1;

    const subscriptionInfo = {
      ...selectedSubscriptionInfo[0].subscriptionInfo,
      quantity: toDecrement,
    };
    rechargeInfo.push({
      ...selectedSubscriptionInfo[0], subscriptionInfo,
    });
    updateRechargePDPInfoReducer(productId, currentlySelectedFrequency, rechargeInfo);
  }
};
