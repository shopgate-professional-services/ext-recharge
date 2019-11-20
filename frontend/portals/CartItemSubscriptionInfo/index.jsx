import React from 'react';
import PropTypes from 'prop-types';
import pluralizeOrderUnit from '../../helpers/pluralizeOrderUnit';
import connect from './connector';
import Label from './components/Label';

/**
 * Distill subscriptions array to array of simpler objects
 * @param {Object[]} subscriptions Subscription objects
 * @return {Object[]}
 */
const distillSubscriptions = subscriptions => subscriptions
  .filter(subscription => (
    typeof subscription === 'object'
    && subscription.charge_interval_frequency
    && subscription.charge_interval_frequency !== null
  ))
  .map((subscription) => {
    const {
      charge_interval_frequency: chargeIntervalFrequency,
      order_interval_unit: orderIntervalUnit,
      quantity,
      price,
    } = subscription;
    const totalPrice = price * quantity;

    const unitLabel = pluralizeOrderUnit(chargeIntervalFrequency, orderIntervalUnit);

    return {
      title: `Every ${chargeIntervalFrequency} ${unitLabel}`,
      quantity,
      price: parseFloat(price),
      totalPrice,
    };
  });

/**
 * CartItemSubscriptionInfo component
 * @param {Object[]} rechargeInfo ReCharge Subscriptions
 * @param {number} totalQuantity Total cart item quantity
 * @param {string} currency Currency code like USD or EUR
 * @param {number} itemUnitPrice Unit price
 * @param {string} cartItemId Cart item id
 * @return {JSX}
 */
const CartItemSubscriptionInfo = ({
  rechargeInfo,
  totalQuantity,
  currency,
  itemUnitPrice,
  cartItemId,
}) => {
  if (!Array.isArray(rechargeInfo)) {
    return null;
  }

  const subscriptionDistillates = distillSubscriptions(rechargeInfo);

  if (!subscriptionDistillates.length) {
    return null;
  }

  const totalQuantityOfSubscriptions = subscriptionDistillates
    .reduce((total, { quantity }) => total + quantity, 0);

  return (
    <div>
      {subscriptionDistillates.map(({
        title,
        quantity,
        price,
        totalPrice,
      }) =>
        (
          <Label
            currency={currency}
            price={price}
            totalPrice={totalPrice}
            title={title}
            quantity={quantity}
            key={`subscription-${cartItemId}-${title}`}
          />
        ))}
      {totalQuantityOfSubscriptions < totalQuantity &&
        <Label
          currency={currency}
          price={itemUnitPrice}
          totalPrice={(totalQuantity - totalQuantityOfSubscriptions) * itemUnitPrice}
          title="recharge.subscription_option.one_time"
          quantity={totalQuantity - totalQuantityOfSubscriptions}
          key={`non-subscription-${cartItemId}`}
        />
      }
    </div>
  );
};

CartItemSubscriptionInfo.propTypes = {
  cartItemId: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  itemUnitPrice: PropTypes.number,
  rechargeInfo: PropTypes.arrayOf(PropTypes.shape()),
  totalQuantity: PropTypes.number,
};

CartItemSubscriptionInfo.defaultProps = {
  rechargeInfo: [],
  itemUnitPrice: 0,
  totalQuantity: 0,
};

export default connect(CartItemSubscriptionInfo);
