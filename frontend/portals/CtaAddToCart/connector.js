import { connect } from 'react-redux';
import { getIsRechargeSubscriptionOnly, isRechargeSubscriptionItemsFetching } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Objec} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  isSubscriptionOnly: getIsRechargeSubscriptionOnly(state, props),
  subscriptionItemsFetching: isRechargeSubscriptionItemsFetching(state, props),
});

export default connect(mapStateToProps);
