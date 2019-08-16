import React from 'react';
import PropTypes from 'prop-types';
import { I18n, InfoIcon } from '@shopgate/engage/components';
import connect from './connector';

/**
 * RechargePortalLink link
 * @param {string} customerHash Recharge customer hash
 * @param {Node} Item Item node
 * @param {Function} openPortal Open portal function
 * @return {JSX}
 */
const RechargePortalLink = ({ customerHash, Item, openPortal }) => {
  if (!customerHash) {
    return null;
  }
  return (
    <Item
      label="recharge.customer_portal.manage_subscriptions"
      icon={InfoIcon}
      onClick={openPortal}
    >
      <I18n.Text string="recharge.customer_portal.manage_subscriptions" />
    </Item>
  );
};

RechargePortalLink.propTypes = {
  Item: PropTypes.func.isRequired,
  customerHash: PropTypes.string,
  openPortal: PropTypes.func,
};

RechargePortalLink.defaultProps = {
  customerHash: null,
  openPortal: () => { },
};

export default connect(RechargePortalLink);
