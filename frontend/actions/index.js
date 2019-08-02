import PipelineRequest from '@shopgate/pwa-core/classes/PipelineRequest';
import { shouldFetchData } from '@shopgate/pwa-common/helpers/redux';

export const fetchSubscriptionProducts = (productIds = []) => (dispatch, getState) => {

  // TODO: add should fetch data check
  
 // dispatch request

  new PipelineRequest('shopgate.recharge.getSubscriptionProducts')
    .setInput({ productIds })
    .dispatch()
    .then(({ products }) => {
      
      
      // dispatch receive
      
    })
    .catch((error) => {
      console.error(error);
      
      // dispatch error
    });
};
