import React from 'react';
import PropTypes from 'prop-types';
import { I18n, Link, RippleButton } from '@shopgate/engage/components';
import styles from './styles';
import { RECHARGE_CHECKOUT_PATH, APPENDED_SHOPIFY_DOMAIN_INFO } from '../../constants';

/**
 * @returns {JSX}
 */
const RechargeCheckoutButton = ({ cartToken, isActive }) => (
  <Link href={`${RECHARGE_CHECKOUT_PATH}${cartToken}${APPENDED_SHOPIFY_DOMAIN_INFO}`} disabled={!isActive}>
    <RippleButton
      disabled={!isActive}
      type="regular"
      className={isActive ? styles.button : styles.disabledButton}
    >
      <I18n.Text string="cart.checkout" />
    </RippleButton>
  </Link>
);

RechargeCheckoutButton.propTypes = {
  cartToken: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default RechargeCheckoutButton;
