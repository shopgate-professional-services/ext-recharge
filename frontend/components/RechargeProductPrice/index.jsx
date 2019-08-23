import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import PriceBase from '@shopgate/pwa-ui-shared/Price';
import styles from './style';

/**
 * Calculate total price to show with additions
 * @param {number} price unit amount
 * @param {Object} additions price modifiers
 * @returns {number}
 */
const getTotalPrice = (price, additions) => {
  if (!additions) {
    return price;
  }
  return price + Object.values(additions)
    .reduce((p, val) => {
      // eslint-disable-next-line no-param-reassign
      p += val;
      return p;
    }, 0);
};

/**
 * @returns {JSX}
 */
const RechargeProductPrice = ({ price, optionsPrices }) => (
  <Fragment>
    <PlaceholderLabel ready={(price !== null)} className={styles.placeholder}>
      {(price && typeof price.unitPrice === 'number') && (
        <PriceBase
          className={styles.price}
          currency={price.currency}
          discounted={!!price.discount}
          taxDisclaimer
          unitPrice={getTotalPrice(price.unitPrice, optionsPrices)}

        />
      )}
    </PlaceholderLabel>
  </Fragment>
);

RechargeProductPrice.propTypes = {
  optionsPrices: PropTypes.shape().isRequired,
  price: PropTypes.shape().isRequired,
};

export default RechargeProductPrice;
