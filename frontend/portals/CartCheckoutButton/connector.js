import { connect } from 'react-redux';
import { getRechargeCartToken, getIsCartBusy, isTokenFetching } from '../../selectors';

/**
 * @param {Object} state state
 * @returns {JSX}
 */
const mapStateToProps = state => ({
  cartToken: getRechargeCartToken(state),
  disabled: getIsCartBusy(state),
  isTokenFetching: isTokenFetching(state),
});

export default connect(mapStateToProps);
