import React from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import AddToCartCTA from '../../components/AddToCartCTA';
import connect from './connector';

/**
 * @returns {JSX}
 */
const CtaAddToCart = ({
  isSubscriptionOnly,
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
      isRechargeOptional={!isSubscriptionOnly}
      subscriptionItemsFetching={subscriptionItemsFetching}
      options={options}
      quantity={quantity}
      productId={variantId || productId}
    />);
  }

  if (!isSubscriptionOnly) {
    return (children);
  }

  return (<AddToCartCTA
    conditioner={conditioner}
    isRechargeOptional={!isSubscriptionOnly}
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
  isSubscriptionOnly: PropTypes.bool,
  subscriptionItemsFetching: PropTypes.bool,
  variantId: PropTypes.string,
};

CtaAddToCart.defaultProps = {
  isSubscriptionOnly: null,
  subscriptionItemsFetching: true,
  variantId: null,
};

export default withCurrentProduct(connect(CtaAddToCart));
