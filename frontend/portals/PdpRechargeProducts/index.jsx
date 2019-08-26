/* eslint-disable camelcase */
import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import RechargeOption from '../../components/RechargeOption';
import SubscriptionDetailsBadge from '../../components/SubscriptionDetailsBadge';
import PdpSubscriptionHeader from '../../components/PdpSubscriptionHeader';
import connect from './connector';

/**
 * @returns {JSX}
 */
const PdpRechargeProducts = ({
  selectedSubscriptionsInfo,
  shopifyVariantId,
  subscriptionInfo,
  updateRechargeInfo,
}) => {
  // if subscriptionInfo is not an array with at least one element return null
  if (!subscriptionInfo) {
    return null;
  }

  const {
    id, discount_amount, discount_type, subscription_defaults,
  } = subscriptionInfo;
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
    <Fragment>
      <PdpSubscriptionHeader
        discountAmount={discount_amount}
        discountType={discount_type}
      />
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
        selectedSubscriptionsInfo={selectedSubscriptionsInfo}
        orderDayOfMonth={order_day_of_month}
        orderDayOfWeek={order_day_of_week}
        orderIntervalFrequency={order_interval_frequency}
        purchaseOption={storefront_purchase_options}
        updateRechargeInfo={updateRechargeInfo}
        shopifyVariantId={shopifyVariantId}
      />
      <SubscriptionDetailsBadge />
    </Fragment>
  );
};

PdpRechargeProducts.propTypes = {
  selectedSubscriptionsInfo: PropTypes.arrayOf(PropTypes.shape()),
  shopifyVariantId: PropTypes.string,
  subscriptionInfo: PropTypes.shape(),
  updateRechargeInfo: PropTypes.func,
};

PdpRechargeProducts.defaultProps = {
  selectedSubscriptionsInfo: null,
  shopifyVariantId: null,
  subscriptionInfo: null,
  updateRechargeInfo: () => { },
};

export default withCurrentProduct(connect(memo(PdpRechargeProducts)));
