import { PipelineRequest, LoadingProvider, logger } from '@shopgate/engage/core';
import updateMetaData from '@shopgate/pwa-common-commerce/product/actions/updateMetadata';
import { CART_PATH } from '@shopgate/engage/cart';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import {
  getRechargeSubscriptionItemsState,
  getRechargeCartState,
} from '../selectors';
import { GET_SUBSCRIPTION_PRODUCT, CREATE_CHECKOUT, GET_CUSTOMER_HASH } from '../constants';
import {
  receiveRechargeSubscriptionItems,
  requestRechargeSubscriptionItems,
  errorRechargeSubscriptionItems,
  receiveRechargeCart,
  requestRechargeCart,
  errorRechargetCart,
  requestRechargeCustomerHash,
  receiveRechargeCustomerHash,
  errorRechargeCustomerHash,
} from '../action-creators';

/**
 * @param {string} productId productId
 * @param {Object} recharge recharge info
 * @returns {Function}
 */
export const setSelectedRechargeSubscription = (productId, recharge) => (dispatch) => {
  const metaData = {
    recharge,
  };

  dispatch(updateMetaData(productId, metaData));
};

/**
 * Fetches subscription product information
 * @param {string} productId product id used to fetch subscription
 * @returns {Function}
 */
export const fetchSubscriptionProducts = (productId = null) => (dispatch, getState) => {
  const state = getState();
  const rechargeSubscriptionItemsState = getRechargeSubscriptionItemsState(state);

  if (rechargeSubscriptionItemsState.isFetching) {
    return;
  }
  dispatch(requestRechargeSubscriptionItems);

  new PipelineRequest(GET_SUBSCRIPTION_PRODUCT)
    .setInput({ productId })
    .dispatch()
    .then(({ products }) => {
      dispatch(receiveRechargeSubscriptionItems(productId, products));
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
