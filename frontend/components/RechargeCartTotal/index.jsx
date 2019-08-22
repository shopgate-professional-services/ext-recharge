import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';

/**
 * @returns {JSX}
 */
const GrandTotal = ({ amount, isLoading, currency }) => (
  <Fragment>
    {amount &&
      <CartTotalLine isDisabled={isLoading} type="grandTotal">
        <CartTotalLine.Label label="cart.total" />
        <CartTotalLine.Amount amount={amount} currency={currency} />
      </CartTotalLine>
    }
  </Fragment>
);

GrandTotal.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default GrandTotal;

