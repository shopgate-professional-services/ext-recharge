import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Link, RippleButton } from '@shopgate/engage/components';
import styles from './styles';
import { RECHARGE_CHECKOUT_PATH, APPENDED_SHOPIFY_DOMAIN_INFO } from '../../constants';

/**
 * @returns {JSX}
 */
const RechargeCheckoutButton = ({ cartToken, disabled }) => (
  <Link
    href={`${RECHARGE_CHECKOUT_PATH}${cartToken}?${APPENDED_SHOPIFY_DOMAIN_INFO}`}
    disabled={disabled || !cartToken}
  >
    <RippleButton
      disabled={disabled || !cartToken}
      type="regular"
      className={!disabled ? styles.button : styles.disabledButton}
    >
      <I18n.Text string="cart.checkout" />
    </RippleButton>
  </Link>
);

RechargeCheckoutButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  cartToken: PropTypes.string,
};

RechargeCheckoutButton.defaultProps = {
  cartToken: null,
};

export default RechargeCheckoutButton;
