import React from 'react';
import PropTypes from 'prop-types';
import { AddToCartButton } from '@shopgate/engage/components';
import connect from './connector';
import styles from './styles';

/**
 * FavoritesAddToCart component
 * @param {boolean} isSubscriptionOnly Is a product that is only subscription product
 * @param {Node} children Original portal children
 * @param {Function} showAlert Show modal alert
 * @param {Function} goToProductPage Direct user to product page
 * @return {JSX}
 */
const FavoritesAddToCart = ({
  isSubscriptionOnly,
  children,
  showAlert,
  goToProductPage,
}) => {
  /**
   * Handel a click when product subscription must be chosen
   */
  const handleNoAddClick = () => {
    showAlert({
      message: 'recharge.favorite_list.modal.message',
      confirm: 'recharge.favorite_list.modal.confirm',
      dismiss: 'recharge.favorite_list.modal.dismiss',
    })
      .then((result) => {
        if (result) {
          goToProductPage();
        }
      });
  };

  if (isSubscriptionOnly) {
    return (
      <AddToCartButton
        isDisabled={false}
        isLoading={false}
        buttonSize={40}
        iconSize={20}
        onClick={handleNoAddClick}
        className={styles.addToCartButton}
      />);
  }

  return children;
};

FavoritesAddToCart.prototypes = {
  children: PropTypes.node.isRequired,
  goToProductPage: PropTypes.func,
  isSubscriptionOnly: PropTypes.bool,
  showAlert: PropTypes.func,
};

FavoritesAddToCart.defaultProps = {
  goToProductPage: () => { },
  isSubscriptionOnly: false,
  showAlert: Promise.resolve(false),
};

export default connect(FavoritesAddToCart);
