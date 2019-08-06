import { connect } from 'react-redux';
import {
  getBaseProductId,
  getVariantId,
  getProductCurrency,
} from '@shopgate/pwa-common-commerce/product';
import { fetchSubscriptionProducts } from '../../actions';
import { getRechargeSubscriptionItems } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Props} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  baseProductId: getBaseProductId(state, props),
  currency: getProductCurrency(state, props),
  subscriptionProducts: getRechargeSubscriptionItems(state),
});

/**
 * @returns {Object}
 */
const mapDispatchToProps = ({
  fetchSubscriptionProducts,
});

export default connect(mapStateToProps, mapDispatchToProps);
