import { connect } from 'react-redux';
import { getCurrency } from '@shopgate/engage/cart';
import {
  getCartLineItemPriceDiscountedBySubscriptions,
  getCartItemRechargeInfoWithSubscription,
  getCartItemProductPrice,
} from '../../selectors';

/**
 * @param {Object} state state
 * @param {Object} props Props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  subscriptionPrice: getCartLineItemPriceDiscountedBySubscriptions(state, props),
  subscriptions: getCartItemRechargeInfoWithSubscription(state, props),
  originalPrice: getCartItemProductPrice(state, props),
  currency: getCurrency(state),
});

export default connect(mapStateToProps);
