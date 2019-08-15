/* eslint-disable camelcase */
import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import RechargeOption from '../../components/RechargeOption';
import SubscriptionDetailsBadge from '../../components/SubscriptionDetailsBadge';
import connect from './connector';

/**
 * @returns {JSX}
 */
const PdpRechargeProducts = ({
  shopifyVariantId,
  subscriptionInfo,
  setSelectedRechargeSubscription,
}) => {
  // if subscriptionInfo is not an array with at least one element return null
  if (!(subscriptionInfo && Array.isArray(subscriptionInfo) && subscriptionInfo.length > 0)) {
    return null;
  }
  return (
    <Fragment>
      <SubscriptionDetailsBadge />
      {
        subscriptionInfo.map((option) => {
          const {
            id, discount_amount, discount_type, subscription_defaults,
          } = option;
          return (
            <RechargeOption
              key={id}
              id={id}
              discountAmount={discount_amount}
              discountType={discount_type}
              frequencyValues={subscription_defaults.order_interval_frequency_options}
              intervalUnit={subscription_defaults.order_interval_unit}
              purchaseOption={subscription_defaults.storefront_purchase_options}
              setSelectedRechargeSubscription={setSelectedRechargeSubscription}
              shopifyVariantId={shopifyVariantId}
            />
          );
        })
      }
    </Fragment>
  );
};

PdpRechargeProducts.propTypes = {
  setSelectedRechargeSubscription: PropTypes.func,
  shopifyVariantId: PropTypes.string,
  subscriptionInfo: PropTypes.arrayOf(PropTypes.shape()),
};

PdpRechargeProducts.defaultProps = {
  setSelectedRechargeSubscription: () => { },
  shopifyVariantId: null,
  subscriptionInfo: null,
};

export default withCurrentProduct(connect(memo(PdpRechargeProducts)));
