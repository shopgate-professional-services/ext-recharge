import { connect } from 'react-redux';
import { getAddToCartMetadata } from '@shopgate/pwa-common-commerce/cart/selectors';
import { setSelectedRechargeSubscription } from '../../actions';
import { getRechargeSubscriptionItems, getVariantId } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Objec} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  subscriptionInfo: getRechargeSubscriptionItems(state, props),
  shopifyVariantId: getVariantId(state, props),
  metaData: getAddToCartMetadata(state, props),

});

/**
 * @param {Function} dispatch dispatch
 * @param {Object} props  props
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, props) => ({
  setSelectedRechargeSubscription: (currentlySelectedFrequency, recharge) =>
    dispatch(setSelectedRechargeSubscription(
      props.productId,
      currentlySelectedFrequency,
      recharge
    )),
});

export default connect(mapStateToProps, mapDispatchToProps);
