import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { logger } from '@shopgate/pwa-core/helpers';
import { getRechargeSubscriptionItemsState } from '../selectors';
import {
  receiveRechargeSubscriptionItems,
  requestRechargeSubscriptionItems,
  errorRechargeSubscriptionItems,
} from '../action-creators';

/**
 * Fetchs subscription product information
 * @param {Array} productIds array of product Id's
 * @returns {Function}
 */
export const fetchSubscriptionProducts = (productIds = []) => (dispatch, getState) => {
  const state = getState();
  const rechargeSubscriptionItemsState = getRechargeSubscriptionItemsState(state);

  if (rechargeSubscriptionItemsState.isFetching) {
    return;
  }
  dispatch(requestRechargeSubscriptionItems);

  new PipelineRequest('shopgate.recharge.getSubscriptionProducts')
    .setInput({ productIds })
    .dispatch()
    .then(({ products }) => {
      dispatch(receiveRechargeSubscriptionItems(products));
    })
    .catch((error) => {
      logger.error(error);
      dispatch(errorRechargeSubscriptionItems);
    });
};
