import React from 'react';
import PropTypes from 'prop-types';
import { REQUIRED_SUBSCRIPTION_TEXT } from '../../constants';
import Options from './components/Options';
/**
 * @param {Array} subsciptionProducts Recharge subscription option information
 * @returns {JSX}
 */
const RechargeOptions = ({ subscriptionProducts }) => {
  const subscriptionOptions = subscriptionProducts.map((option) => {
    const subscriptionFrequencies =
      option.subscription_defaults.order_interval_frequency_options.map(frequency => frequency);

    const intervalUnit = option.subscription_defaults.order_interval_unit;

    return (
      <Options
        key={option.collection_id}
        intervalUnit={intervalUnit}
        frequency={subscriptionFrequencies}
        required={
          option.subscription_defaults.storefront_purchase_options === REQUIRED_SUBSCRIPTION_TEXT
        }
      />
    );
  }) || null;

  return (
    subscriptionOptions
  );
};

RechargeOptions.propTypes = {
  subscriptionProducts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default RechargeOptions;
