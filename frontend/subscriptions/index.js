import { appDidStart$ } from '@shopgate/pwa-common/streams/app';
import { fetchSubscriptionProducts } from '../actions';

export default (subscribe) => {

  // fetch user info when app returns to the foreground
  subscribe(appDidStart$, ({ dispatch }) => {

    window.recharge = (Ids) => dispatch(fetchSubscriptionProducts(Ids))

  });



};
