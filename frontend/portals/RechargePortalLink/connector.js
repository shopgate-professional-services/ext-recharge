import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';
import { getRechargeCustomerHash } from '../../selectors';
import getUrl from '../../helpers/generateRechargeCustomerPortalUrl';

/**
 * @param {Object} state state
 * @returns {Object}
 */
const mapStateToProps = state => ({
  customerHash: getRechargeCustomerHash(state),
});

/**
 * @param {Function} dispatch dispatch
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  openPortal: customerHash => dispatch(historyPush({ pathname: getUrl(customerHash) })),
});

export default connect(mapStateToProps, mapDispatchToProps);
