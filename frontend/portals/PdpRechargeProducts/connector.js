import { connect } from 'react-redux';
import { getRechargeSubscriptionItems } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Props} props props
 * @returns {Object}
 */
const mapStateToProps = state => ({
  subscriptionProducts: getRechargeSubscriptionItems(state),
});

export default connect(mapStateToProps);
