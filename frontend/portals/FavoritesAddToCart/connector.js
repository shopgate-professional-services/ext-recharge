import { connect } from 'react-redux';
import { showModal, historyPush, bin2hex } from '@shopgate/engage/core';
import { ITEM_PATH } from '@shopgate/engage/product';
import { getIsReChargeSubscriptionOnly } from '../../selectors';

/**
 * @param {Object} state state
 * @param {Object} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  isSubscriptionOnly: getIsReChargeSubscriptionOnly(state, props),
});

/**
 * @param {Function} dispatch dispatch
 * @param {Object} props  props
 * @returns {Object}
 */
const mapDispatchToProps = (dispatch, { productId }) => ({
  showAlert: options => dispatch(showModal(options)),
  goToProductPage: () => (
    dispatch(historyPush({ pathname: `${ITEM_PATH}/${bin2hex(productId)}` }))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps);
