import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import RechargeCheckoutButton from '../../components/RechargeCheckoutButton';

/**
 * @returns {JSX}
 */
const CartCheckoutButton = ({ cartToken, disabled, children }) => {
  if (!cartToken) {
    return children;
  }
  return (<RechargeCheckoutButton cartToken={cartToken} disabled={disabled} />);
};

CartCheckoutButton.propTypes = {
  children: PropTypes.node.isRequired,
  cartToken: PropTypes.string,
  disabled: PropTypes.bool,
};

CartCheckoutButton.defaultProps = {
  cartToken: null,
  disabled: false,
};

export default connect(CartCheckoutButton);
