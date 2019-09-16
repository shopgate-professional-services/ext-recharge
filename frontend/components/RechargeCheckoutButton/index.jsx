import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Link, RippleButton } from '@shopgate/engage/components';
import styles from './styles';
import { RECHARGE_CHECKOUT_PATH, APPENDED_SHOPIFY_DOMAIN_INFO } from '../../constants';

/**
 * @returns {JSX}
 */
const RechargeCheckoutButton = ({ cartToken, disabled }) => (
  <Link href={`${RECHARGE_CHECKOUT_PATH}${cartToken}?${APPENDED_SHOPIFY_DOMAIN_INFO}`} isActive={!disabled}>
    <RippleButton
      isActive={!disabled}
      type="regular"
      className={!disabled ? styles.button : styles.disabledButton}
    >
      <I18n.Text string="cart.checkout" />
    </RippleButton>
  </Link>
);

RechargeCheckoutButton.propTypes = {
  cartToken: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default RechargeCheckoutButton;
