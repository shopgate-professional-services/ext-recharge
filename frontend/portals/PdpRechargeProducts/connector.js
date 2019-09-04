import { connect } from 'react-redux';
import { getRechargeSubscriptionItems, getVariantId } from '../../selectors';
import { updateRechargeInfo, updateShopifyVariantId } from '../../action-creators';

/**
 * @param {Object} state state
 * @param {Object} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  shopifyVariantId: getVariantId(state, props),
  subscriptionInfo: getRechargeSubscriptionItems(state, props),
});

/**
 * @param {Function} dispatch dispatch
 * @param {Object} props  props
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, props) => ({
  updateRechargeInfo: recharge =>
    dispatch(updateRechargeInfo(
      props.productId,
      recharge
    )),
  updateShopifyVariantId: shopifyVariantId =>
    dispatch(updateShopifyVariantId(
      props.productId,
      shopifyVariantId
    )),
});

export default connect(mapStateToProps, mapDispatchToProps);
