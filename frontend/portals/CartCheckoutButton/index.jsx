import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import RechargeCheckoutButton from '../../components/RechargeCheckoutButton';

/**
 * @returns {JSX}
 */
const CartCheckoutButton = ({ cartToken, isActive, children }) => (
  // <RechargeCheckoutButton cartToken={cartToken} isActive={isActive} />
  children
);

CartCheckoutButton.propTypes = {
  cartToken: PropTypes.string,
  isActive: PropTypes.bool,
};

CartCheckoutButton.defaultProps = {
  cartToken: null,
  isActive: false,
};

export default connect(CartCheckoutButton);
