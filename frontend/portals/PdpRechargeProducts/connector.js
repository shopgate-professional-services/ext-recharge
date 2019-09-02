import { connect } from 'react-redux';
import { getBaseProductId } from '@shopgate/engage/product';
import { updateRechargeInfoReducer } from '../../actions';
import { getRechargeSubscriptionItems, getVariantId } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Object} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  shopifyVariantId: getVariantId(state, props),
  subscriptionInfo: getRechargeSubscriptionItems(state, props),
  baseProductId: getBaseProductId(state, props),
});

/**
 * @param {Function} dispatch dispatch
 * @param {Object} props  props
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, props) => ({
  updateRechargeInfo: recharge =>
    dispatch(updateRechargeInfoReducer(
      props.variantId || props.productId,
      recharge
    )),
});

export default connect(mapStateToProps, mapDispatchToProps);
