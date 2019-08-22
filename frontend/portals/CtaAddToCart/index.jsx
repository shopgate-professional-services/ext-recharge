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
  productId,
  options,
  quantity,
  subscriptionItemsFetching,
  variantId,
}) => {
  if (subscriptionItemsFetching) {
    return (<AddToCartCTA
      conditioner={conditioner}
      isRechargeOptional={isRechargeOptional !== REQUIRED_SUBSCRIPTION_TEXT}
      subscriptionItemsFetching={subscriptionItemsFetching}
      options={options}
      quantity={quantity}
      productId={variantId || productId}
    />);
  }

  if (!isRechargeOptional) {
    return (children);
  }

  return (<AddToCartCTA
    conditioner={conditioner}
    isRechargeOptional={isRechargeOptional !== REQUIRED_SUBSCRIPTION_TEXT}
    options={options}
    quantity={quantity}
    subscriptionItemsFetching={subscriptionItemsFetching}
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
  subscriptionItemsFetching: PropTypes.bool,
  variantId: PropTypes.string,
};

CtaAddToCart.defaultProps = {
  isRechargeOptional: null,
  subscriptionItemsFetching: true,
  variantId: null,
};

export default withCurrentProduct(connect(CtaAddToCart));
