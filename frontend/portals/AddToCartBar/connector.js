import { connect } from 'react-redux';
import { getIsRechargeOptional, isRechargeSubscriptionItemsFetching } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Objec} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  isRechargeOptional: getIsRechargeOptional(state, props),
  subscriptionItemsFetching: isRechargeSubscriptionItemsFetching(state, props),
});

export default connect(mapStateToProps);
