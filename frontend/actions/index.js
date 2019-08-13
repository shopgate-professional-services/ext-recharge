import { PipelineRequest, LoadingProvider, logger } from '@shopgate/engage/core';
import updateMetaData from '@shopgate/pwa-common-commerce/product/actions/updateMetadata';
import { CART_PATH } from '@shopgate/engage/cart';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import {
  getRechargeSubscriptionItemsState,
  getRechargeCartTokenState,
} from '../selectors';
import { GET_SUBSCRIPTION_PRODUCT, CREATE_CHECKOUT_TOKEN } from '../constants';
import {
  receiveRechargeSubscriptionItems,
  requestRechargeSubscriptionItems,
  errorRechargeSubscriptionItems,
  receiveRechargeCartToken,
  requestRechargeCartToken,
  errorRechargetCartToken,
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
 * Fetchs subscription product information
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
export const fetchRechargeCartToken = () => (dispatch, getState) => {
  const state = getState();
  const rechargeCartTokenState = getRechargeCartTokenState(state);

  if (rechargeCartTokenState.isFetching) {
    return;
  }

  LoadingProvider.setLoading(CART_PATH);

  dispatch(requestRechargeCartToken());

  new PipelineRequest(CREATE_CHECKOUT_TOKEN)
    .setHandleErrors(ERROR_HANDLE_SUPPRESS)
    .dispatch()
    .then((response) => {
      dispatch(receiveRechargeCartToken(response));
      LoadingProvider.unsetLoading(CART_PATH);
    })
    .catch((err) => {
      logger.error(err);
      dispatch(errorRechargetCartToken());
      LoadingProvider.unsetLoading(CART_PATH);
    });
};

export const addShopifyVariantId = (productId, shopifyVariantId) => (dispatch) => {
  console.warn('henlo');
  const metaData = {
    shopifyVariantId,
  };

  dispatch(updateMetaData(productId, metaData));
};
