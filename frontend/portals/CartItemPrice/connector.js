import { connect } from 'react-redux';
import {
  getCartLineItemPriceDiscountedBySubscriptions,
  getCartItemRechargeInfo,
  getCartItemProductPrice,
} from '../../selectors';

/**
 * @param {Object} state state
 * @param {Object} props Props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  subscriptionPrice: getCartLineItemPriceDiscountedBySubscriptions(state, props),
  subscriptions: getCartItemRechargeInfo(state, props),
  originalPrice: getCartItemProductPrice(state, props),
});

export default connect(mapStateToProps);
