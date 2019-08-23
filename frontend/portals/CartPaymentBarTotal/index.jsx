import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import RechargeCartTotal from '../../components/RechargeCartTotal';

/**
 * @returns {JSX}
 */
const CartPaymentBarTotal = ({
  total,
  currency,
  isLoading,
  children,
}) => {
  if (!total) {
    return children;
  }
  return (<RechargeCartTotal amount={total} currency={currency} isLoading={isLoading} />);
};

CartPaymentBarTotal.propTypes = {
  children: PropTypes.node.isRequired,
  currency: PropTypes.string,
  isLoading: PropTypes.bool,
  total: PropTypes.number,
};

CartPaymentBarTotal.defaultProps = {
  currency: null,
  isLoading: false,
  total: null,
};

export default connect(CartPaymentBarTotal);
