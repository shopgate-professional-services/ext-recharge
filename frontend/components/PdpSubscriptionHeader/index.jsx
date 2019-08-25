import React from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import { I18n } from '@shopgate/engage/components';
import { getDisplayDiscount, getDiscountedPrice } from '../../helpers/rechargeDiscountPriceTools';
import connect from './connector';
import styles from './styles';

/**
 * PdpSubscriptionHeader component
 * @param {string} currency Currency code like EUR or USD
 * @param {number} discountAmount Discount amount
 * @param {string} discountType Discount type
 * @param {number} unitPrice Unit price without subscription discount
 * @return {JSX}
 */
const PdpSubscriptionHeader = ({
  currency,
  discountAmount,
  discountType,
  unitPrice,
}) => {
  if (currency && discountAmount) {
    return (
      <div className={styles.wrapper}>
        <span className={styles.bold}>
          <I18n.Text string="recharge.subscription_option.subscribe_and_save" />
        </span>
        <span>
          {` (${getDisplayDiscount(discountType, discountAmount, currency)}): `}
          <I18n.Price
            currency={currency}
            price={getDiscountedPrice(unitPrice, discountType, discountAmount)}
          />
        </span>
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <span className={styles.bold}>
        <I18n.Text string="recharge.subscription_option.subscribe" />
      </span>
    </div>
  );
};

PdpSubscriptionHeader.propTypes = {
  currency: PropTypes.string,
  discountAmount: PropTypes.number,
  discountType: PropTypes.string,
  unitPrice: PropTypes.number,
};

PdpSubscriptionHeader.defaultProps = {
  currency: null,
  discountAmount: 0,
  discountType: null,
  unitPrice: 0,
};

export default withCurrentProduct(connect(PdpSubscriptionHeader));
