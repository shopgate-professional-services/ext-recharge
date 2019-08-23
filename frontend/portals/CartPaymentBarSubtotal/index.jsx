import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import RechargeCartSubtotal from '../../components/RechargeCartSubtotal';

/**
 * @returns {JSX}
 */
const CartPaymentBarSubtotal = ({
  subtotal,
  currency,
  children,
  isLoading,
}) => {
  if (!subtotal) {
    return children;
  }
  return (<RechargeCartSubtotal amount={subtotal} currency={currency} isLoading={isLoading} />);
};

CartPaymentBarSubtotal.propTypes = {
  children: PropTypes.node.isRequired,
  currency: PropTypes.string,
  isLoading: PropTypes.bool,
  subtotal: PropTypes.number,
};

CartPaymentBarSubtotal.defaultProps = {
  currency: null,
  isLoading: false,
  subtotal: null,
};

export default connect(CartPaymentBarSubtotal);
