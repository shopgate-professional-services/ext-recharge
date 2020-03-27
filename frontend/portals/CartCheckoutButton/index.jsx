import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import RechargeCheckoutButton from '../../components/RechargeCheckoutButton';

/**
 * @returns {JSX}
 */
const CartCheckoutButton = ({ cartToken, disabled, children, isTokenFetching }) => {
  if (!cartToken && !isTokenFetching) {
    return children;
  }

  return (<RechargeCheckoutButton cartToken={cartToken} disabled={disabled} />);
};

CartCheckoutButton.propTypes = {
  children: PropTypes.node.isRequired,
  cartToken: PropTypes.string,
  disabled: PropTypes.bool,
  isTokenFetching: PropTypes.bool,
};

CartCheckoutButton.defaultProps = {
  cartToken: null,
  disabled: false,
  isTokenFetching: false,
};

export default connect(CartCheckoutButton);
