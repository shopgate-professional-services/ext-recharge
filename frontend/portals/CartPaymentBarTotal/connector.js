import { connect } from 'react-redux';
import { getCurrency } from '@shopgate/pwa-common-commerce/cart/selectors';
import { getRechargeTotalPrice, getIsCartBusy } from '../../selectors';

/**
 * @param {Object} state state
 * @returns {JSX}
 */
const mapStateToProps = state => ({
  total: getRechargeTotalPrice(state),
  currency: getCurrency(state),
  isLoading: getIsCartBusy(state),
});

export default connect(mapStateToProps);
