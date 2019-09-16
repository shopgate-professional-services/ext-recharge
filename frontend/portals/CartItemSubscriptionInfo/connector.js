import { connect } from 'react-redux';
import { getCurrency } from '@shopgate/engage/cart';
import {
  getCartItemRechargeInfo,
  getCartItemProductUnitPrice,
  getCartItemQuantity,
} from '../../selectors';

/**
 * @param {Object} state state
 * @param {Object} props Props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  subscriptions: getCartItemRechargeInfo(state, props),
  itemUnitPrice: getCartItemProductUnitPrice(state, props),
  totalQuantity: getCartItemQuantity(state, props),
  currency: getCurrency(state),
});

export default connect(mapStateToProps);
