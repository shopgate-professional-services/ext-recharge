import React from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import AddToCartCTA from '../../components/AddToCartCTA';
import { REQUIRED_SUBSCRIPTION_TEXT } from '../../constants';
import connect from './connector';

/**
 * @returns {JSX}
 */
const CtaAddToCart = ({
  isRechargeOptional,
  children,
  conditioner,
  options,
  quantity,
  productId,
  variantId,
}) => {
  if (!isRechargeOptional) {
    return (children);
  }

  return (<AddToCartCTA
    conditioner={conditioner}
    isRechargeOptional={isRechargeOptional === REQUIRED_SUBSCRIPTION_TEXT}
    options={options}
    quantity={quantity}
    productId={variantId || productId}
  />);
};

CtaAddToCart.propTypes = {
  children: PropTypes.node.isRequired,
  conditioner: PropTypes.shape().isRequired,
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  isRechargeOptional: PropTypes.string,
  variantId: PropTypes.string,
};

CtaAddToCart.defaultProps = {
  isRechargeOptional: null,
  variantId: null,
};

export default withCurrentProduct(connect(CtaAddToCart));
