import { connect } from 'react-redux';
import { updateRechargePDPInfoReducer } from '../../actions';
import { getRechargeSubscriptionItems, getVariantId, getSelectedSubscriptionsInfo } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Objec} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  selectedSubscriptionsInfo: getSelectedSubscriptionsInfo(state, props),
  shopifyVariantId: getVariantId(state, props),
  subscriptionInfo: getRechargeSubscriptionItems(state, props),

});

/**
 * @param {Function} dispatch dispatch
 * @param {Object} props  props
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, props) => ({
  updateRechargePDPInfo: (currentlySelectedFrequency, recharge) =>
    dispatch(updateRechargePDPInfoReducer(
      props.productId,
      currentlySelectedFrequency,
      recharge
    )),
});

export default connect(mapStateToProps, mapDispatchToProps);
