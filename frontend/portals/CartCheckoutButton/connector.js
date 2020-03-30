import { connect } from 'react-redux';
import {
  getRechargeCartToken,
  getIsCartBusy,
  isTokenFetching,
  getIsTokenErrored,
} from '../../selectors';

/**
 * @param {Object} state state
 * @returns {JSX}
 */
const mapStateToProps = state => ({
  cartToken: getRechargeCartToken(state),
  disabled: getIsCartBusy(state),
  isTokenFetching: isTokenFetching(state),
  isError: getIsTokenErrored(state),
});

export default connect(mapStateToProps);
