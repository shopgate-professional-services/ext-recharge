import { cloneElement } from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

/**
 * Determine if two price objects are equal
 * @param {Object} priceOne Cart item price object
 * @param {Object} priceTwo Cart item price object
 * @return {boolean}
 */
const arePricesEqual = (priceOne = {}, priceTwo = {}) => (
  priceOne.default === priceTwo.default && priceOne.special === priceTwo.special
);

/**
 * CartItemPrice portal component
 * @param {Object} subscriptionPrice Cart item price object
 * @param {Object[]} subscriptions ReCharge subscriptions
 * @param {Object} originalPrice  Cart item price object
 * @param {Node} children Portals original children
 * @return {Node}
 */
const CartItemPrice = ({
  subscriptionPrice,
  subscriptions,
  originalPrice,
  children,
}) => {
  if (!subscriptions.length || arePricesEqual(subscriptionPrice, originalPrice)) {
    return children;
  }
  const { special: specialPrice, default: defaultPrice } = subscriptionPrice
  const unitPrice = specialPrice || defaultPrice;
  const discounted = !!specialPrice
  return cloneElement(children, { unitPrice, discounted });
};

CartItemPrice.propTypes = {
  children: PropTypes.node.isRequired,
  originalPrice: PropTypes.shape(),
  subscriptionPrice: PropTypes.shape(),
  subscriptions: PropTypes.arrayOf(PropTypes.shape()),
};

CartItemPrice.defaultProps = {
  originalPrice: {},
  subscriptionPrice: {},
  subscriptions: [],
};

export default connect(CartItemPrice);
