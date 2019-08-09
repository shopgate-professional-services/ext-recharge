import { connect } from 'react-redux';
import { getRechargeCartToken, getIsCartBusy } from '../../selectors';
import { fetchRechargeCartToken } from '../../actions';

/**
 * @param {Object} state state
 * @returns {JSX}
 */
const mapStateToProps = state => ({
  cartToken: getRechargeCartToken(state),
  isActive: getIsCartBusy(state),
});

const mapDispatchToProps = {
  fetchRechargeCartToken,
};

export default connect(mapStateToProps, mapDispatchToProps);
