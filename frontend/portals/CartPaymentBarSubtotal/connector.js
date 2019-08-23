import { connect } from 'react-redux';
import { getCurrency } from '@shopgate/pwa-common-commerce/cart/selectors';
import { getRechargeSubtotalPrice, getIsCartBusy } from '../../selectors';

/**
 * @param {Object} state state
 * @returns {JSX}
 */
const mapStateToProps = state => ({
  subtotal: getRechargeSubtotalPrice(state),
  currency: getCurrency(state),
  isLoading: getIsCartBusy(state),
});

export default connect(mapStateToProps);
