import React from 'react';
import PropTypes from 'prop-types';
import { Grid, I18n } from '@shopgate/engage/components';
import styles from './styles';

/**
 * Label component
 * @param {string} title Title
 * @param {number} price Price of one
 * @param {number} quantity Quantity
 * @param {number} totalPrice Total price of all
 * @param {string} currency Currency code like USD
 * @return {JSX}
 */
const Label = ({
  title,
  price,
  quantity,
  totalPrice,
  currency,
}) => (
  <Grid className={styles.label}>
    <Grid.Item>
      {title}
    </Grid.Item>
    <Grid.Item>
      <I18n.Price
        currency={currency}
        price={price}
      />
    </Grid.Item>
    <Grid.Item>
      {`x${quantity}`}
    </Grid.Item>
    <Grid.Item>
      <I18n.Price
        currency={currency}
        price={totalPrice}
      />
    </Grid.Item>
  </Grid>
);

Label.propTypes = {
  currency: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

export default Label;
