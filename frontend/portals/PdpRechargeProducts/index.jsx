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
  metaData,
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

          const {
            charge_interval_frequency,
            cutoff_day_of_month,
            cutoff_day_of_week,
            expire_after_spefific_number_of_charges,
            number_charges_until_expiration,
            order_day_of_month,
            order_day_of_week,
            order_interval_frequency,
            order_interval_frequency_options,
            order_interval_unit,
            storefront_purchase_options,
          } = subscription_defaults;

          return (
            <RechargeOption
              key={id}
              id={id}
              chargeIntervalFrequency={charge_interval_frequency}
              cutoffDayOfMonth={cutoff_day_of_month}
              cutoffDayOfWeek={cutoff_day_of_week}
              discountAmount={discount_amount}
              discountType={discount_type}
              expireAfterSpecificNumberOfCharges={expire_after_spefific_number_of_charges}
              frequencyValues={order_interval_frequency_options}
              intervalUnit={order_interval_unit}
              /**
               * numberChargesUntilExpiration currently not used
               * We can maybe use as additional label like stock of subscription
               */
              numberChargesUntilExpiration={number_charges_until_expiration}
              metaData={metaData}
              orderDayOfMonth={order_day_of_month}
              orderDayOfWeek={order_day_of_week}
              orderIntervalFrequency={order_interval_frequency}
              purchaseOption={storefront_purchase_options}
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
  metaData: PropTypes.shape(),
  setSelectedRechargeSubscription: PropTypes.func,
  shopifyVariantId: PropTypes.string,
  subscriptionInfo: PropTypes.arrayOf(PropTypes.shape()),
};

PdpRechargeProducts.defaultProps = {
  metaData: null,
  setSelectedRechargeSubscription: () => { },
  shopifyVariantId: null,
  subscriptionInfo: null,
};

export default withCurrentProduct(connect(memo(PdpRechargeProducts)));
