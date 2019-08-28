import { PipelineRequest, LoadingProvider, logger } from '@shopgate/engage/core';
import updateMetaData from '@shopgate/pwa-common-commerce/product/actions/updateMetadata';
import { CART_PATH } from '@shopgate/engage/cart';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import {
  getReChargeFullSubscriptionItem,
  getRechargeCartState,
} from '../selectors';
import { GET_SUBSCRIPTION_PRODUCTS, CREATE_CHECKOUT, GET_CUSTOMER_HASH } from '../constants';
import {
  requestRechargeSubscriptionItems,
  receiveRechargeSubscriptionItems,
  errorRechargeSubscriptionItems,
  updateRechargeInfo,
  requestRechargeCart,
  receiveRechargeCart,
  errorRechargetCart,
  requestRechargeCustomerHash,
  receiveRechargeCustomerHash,
  errorRechargeCustomerHash,
} from '../action-creators';

/**
 * @param {string} productId productId
 * @param {Object} rechargeInfo recharge info
 * @returns {Function}
 */
export const updateRechargeInfoReducer = (productId, rechargeInfo) =>
  (dispatch) => {
    const metaData = {
      rechargeInfo,
    };
    dispatch(updateMetaData(productId, metaData));
    dispatch(updateRechargeInfo(productId, rechargeInfo));
  };

/**
 * Fetches subscription product information
 * @param {string[]} productIds product ids used to fetch subscription
 * @returns {Function}
 */
export const fetchSubscriptionProducts = (productIds = []) => (dispatch, getState) => {
  const state = getState();
  // find products not already in redux state
  const productIdsToFetch = productIds.filter((productId) => {
    const storedSubscriptionProduct = getReChargeFullSubscriptionItem(state, { productId });

    if (!storedSubscriptionProduct) {
      return true;
    }
    return !storedSubscriptionProduct.isFetching && storedSubscriptionProduct.expires <= Date.now();
  });
  // return if there are no products to fetch from ReCharge API
  if (!productIdsToFetch.length) {
    return;
  }

  dispatch(requestRechargeSubscriptionItems(productIdsToFetch));

  new PipelineRequest(GET_SUBSCRIPTION_PRODUCTS)
    .setInput({ productIds })
    .dispatch()
    .then(({ products }) => {
      dispatch(receiveRechargeSubscriptionItems(productIdsToFetch, products));
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
