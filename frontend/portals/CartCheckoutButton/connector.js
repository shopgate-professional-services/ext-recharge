import { connect } from 'react-redux';
import { getRechargeCartToken, getIsCartBusy } from '../../selectors';

/**
 * @param {Object} state state
 * @returns {JSX}
 */
const mapStateToProps = state => ({
  cartToken: getRechargeCartToken(state),
  disabled: getIsCartBusy(state),
});

export default connect(mapStateToProps);
