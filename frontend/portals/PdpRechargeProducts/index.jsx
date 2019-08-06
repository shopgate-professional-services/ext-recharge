/* eslint-disable camelcase */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import RechargeOption from '../../components/RechargeOption';
import connect from './connector';

/**
 * @returns {JSX}
 */
const PdpRechargeProducts = ({ subscriptionProducts }) => {
  if (!subscriptionProducts) {
    return null;
  }

  console.warn('subscriptionProducts: ', subscriptionProducts);

  return subscriptionProducts.map((option) => {
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
      />
    );
  });
};
PdpRechargeProducts.propTypes = {
  subscriptionProducts: PropTypes.arrayOf(PropTypes.shape()),
};

PdpRechargeProducts.defaultProps = {
  subscriptionProducts: null,
};

export default connect(memo(PdpRechargeProducts));
