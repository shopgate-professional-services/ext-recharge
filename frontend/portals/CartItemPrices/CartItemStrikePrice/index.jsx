import React from 'react';
import PropTypes from 'prop-types';
import { PriceStriked } from '@shopgate/engage/components';
import connect from '../connector';
import styles from './styles';

/**
 * CartItemStrikePrice portal component
 * @param {Object} subscriptionPrice Cart item price object
 * @param {Object[]} subscriptions ReCharge subscriptions
 * @param {Object} originalPrice  Cart item price object
 * @param {Node} children Portals original children
 * @param {string} currency Currency code like USD or EUR
 * @return {Node}
 */
const CartItemStrikePrice = ({
  subscriptionPrice,
  subscriptions,
  originalPrice,
  children,
  currency,
}) => {
  // if there is no subscriptions or if there was an original special price just return original
  if (!subscriptions.length || originalPrice.special) {
    return children;
  }
  const { special: specialPrice, default: defaultPrice } = subscriptionPrice;

  if (!specialPrice) {
    return null;
  }

  return (
    <PriceStriked
      className={styles.strikePrice}
      value={defaultPrice}
      currency={currency}
    />
  );
};

CartItemStrikePrice.propTypes = {
  children: PropTypes.node.isRequired,
  currency: PropTypes.string.isRequired,
  originalPrice: PropTypes.shape(),
  subscriptionPrice: PropTypes.shape(),
  subscriptions: PropTypes.arrayOf(PropTypes.shape()),
};

CartItemStrikePrice.defaultProps = {
  originalPrice: {},
  subscriptionPrice: {},
  subscriptions: [],
};

export default connect(CartItemStrikePrice);
