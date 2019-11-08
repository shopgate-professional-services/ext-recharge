import { PipelineRequest, LoadingProvider, logger } from '@shopgate/engage/core';
import { getAddToCartOptions } from '@shopgate/pwa-common-commerce/cart/selectors';
import addProductsToCart from '@shopgate/pwa-common-commerce/cart/actions/addProductsToCart';
import { CART_PATH } from '@shopgate/engage/cart';
import { ITEM_PATH, getBaseProductId } from '@shopgate/engage/product';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { ERROR_HANDLE_SUPPRESS } from '@shopgate/pwa-core/constants/ErrorHandleTypes';
import {
  getReChargeFullSubscriptionItem,
  getRechargeCartState, getSelectedSubscriptionsInfo, getVariantId,
} from '../selectors';
import {
  GET_SUBSCRIPTION_PRODUCTS,
  GET_CART,
  GET_CUSTOMER_HASH,
  SET_BLOCK_RECHARGE_CART,
} from '../constants';
import {
  requestRechargeSubscriptionProducts,
  receiveRechargeSubscriptionProducts,
  errorRechargeSubscriptionProducts,
  requestRechargeCart,
  receiveRechargeCart,
  errorRechargeCart,
  requestRechargeCustomerHash,
  receiveRechargeCustomerHash,
  errorRechargeCustomerHash,
} from '../action-creators';

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

  if (productIds.length === 1) {
    LoadingProvider.setLoading(`${ITEM_PATH}/${bin2hex(productIds[0])}`);
  }

  dispatch(requestRechargeSubscriptionProducts(productIdsToFetch));

  new PipelineRequest(GET_SUBSCRIPTION_PRODUCTS)
    .setInput({ productIds: productIdsToFetch })
    .dispatch()
    .then(({ products }) => {
      dispatch(receiveRechargeSubscriptionProducts(productIdsToFetch, products));
      LoadingProvider.unsetLoading(`${ITEM_PATH}/${bin2hex(productIds[0])}`);
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorRechargeSubscriptionProducts(productIdsToFetch));
      LoadingProvider.unsetLoading(`${ITEM_PATH}/${bin2hex(productIds[0])}`);
    });
};

/**
 * @returns {Function}
 */
export const fetchRechargeCart = () => (dispatch, getState) => {
  const state = getState();
  const rechargeCartState = getRechargeCartState(state);

  if (rechargeCartState.isFetching || rechargeCartState.isBlocked) {
    return;
  }

  LoadingProvider.setLoading(CART_PATH);

  dispatch(requestRechargeCart());
  new PipelineRequest(GET_CART)
    .dispatch()
    .then((response) => {
      dispatch(receiveRechargeCart(response.rechargeCart));
      LoadingProvider.unsetLoading(CART_PATH);
    })
    .catch((err) => {
      logger.error(err);
      dispatch(errorRechargeCart());
      LoadingProvider.unsetLoading(CART_PATH);
    });
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
 * Adds a product to the cart.
 * @param {Object} data The pieces for the product to be added.
 * @return {Function} A redux thunk.
 */
export const addProductToCart = data => (dispatch, getState) => {
  const state = getState();

  // Transform the options to the required format for the pipeline request.
  const options = getAddToCartOptions(state, data);
  const { productId, quantity } = data;

  const baseProductId = getBaseProductId(state, {
    variantId: productId,
    productId,
  });

  const rechargeInfo = getSelectedSubscriptionsInfo(state, {
    baseProductId,
    variantId: productId,
  });
  const shopifyVariantId = getVariantId(state, { productId });

  dispatch(addProductsToCart([{
    productId,
    quantity,
    ...(options) && { options },
    metadata: {
      rechargeInfo,
      shopifyVariantId,
      baseProductId,
    },
  }]));
};

/**
 * Sets a flag on recharge cart to determine if pipeline should fetch
 * @param {boolean} flag Flag for pausing
 * @returns {Function}
 */
export const setBlockRechargeCart = flag => (dispatch) => {
  dispatch({
    type: SET_BLOCK_RECHARGE_CART,
    flag,
  });
};
