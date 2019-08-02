import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

/**
 * @returns {JSX}
 */
const PdpRechargeProducts = ({ subscriptionProducts }) => {
  console.warn(subscriptionProducts); return (<div>hi</div>);
};

PdpRechargeProducts.propTypes = {
  subscriptionProducts: PropTypes.shape().isRequired,
};

export default connect(PdpRechargeProducts);
