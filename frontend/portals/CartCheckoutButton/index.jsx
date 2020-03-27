import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import RechargeCheckoutButton from '../../components/RechargeCheckoutButton';

/**
 * @returns {JSX}
 */
const CartCheckoutButton = ({
  cartToken,
  disabled,
  children,
  isTokenFetching,
  isError,
}) => {
  if (!cartToken && !isTokenFetching && !isError) {
    return children;
  }

  return (<RechargeCheckoutButton cartToken={cartToken} disabled={disabled || isError} />);
};

CartCheckoutButton.propTypes = {
  children: PropTypes.node.isRequired,
  cartToken: PropTypes.string,
  disabled: PropTypes.bool,
  isError: PropTypes.bool,
  isTokenFetching: PropTypes.bool,
};

CartCheckoutButton.defaultProps = {
  cartToken: null,
  disabled: false,
  isError: false,
  isTokenFetching: false,
};

export default connect(CartCheckoutButton);
