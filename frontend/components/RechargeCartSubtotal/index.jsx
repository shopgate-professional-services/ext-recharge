import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CartTotalLine from '@shopgate/pwa-ui-shared/CartTotalLine';

/**
 * @returns {JSX}
 */
const SubTotal = ({ amount, isLoading, currency }) => (
  <Fragment>
    {amount &&
      <CartTotalLine isDisabled={isLoading} type="subTotal">
        <CartTotalLine.Label label="cart.subtotal" />
        <CartTotalLine.Amount amount={amount} currency={currency} />
      </CartTotalLine>
    }
  </Fragment>
);

SubTotal.propTypes = {
  amount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default SubTotal;

