import { connect } from 'react-redux';
import { getRechargeSubscriptionItems } from '../../selectors';

/**
 * @param {Object} state state
 * @returns {Object}
 */
const mapStateToProps = state => ({
  subscriptionProducts: getRechargeSubscriptionItems(state),
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps);
