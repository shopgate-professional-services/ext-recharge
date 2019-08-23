import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import Label from './components/Label';
import { getDiscountedPrice } from '../../helpers/rechargeDiscountPriceTools';

/**
 * Distill subscriptions array to array of simpler objects
 * @param {Object[]} subscriptions Subscription objects
 * @param {number} itemUnitPrice Item unit price
 * @return {Object[]}
 */
const distillSubscriptions = (subscriptions, itemUnitPrice) => subscriptions
  .filter(subscription => (
    typeof subscription === 'object'
    && subscription.frequencyValue
    && subscription.subscriptionInfo
  ))
  .map((subscription) => {
    const {
      frequencyValue,
      subscriptionInfo: {
        intervalUnit = '',
        quantity = 0,
        discountType,
        discountAmount,
      },
    } = subscription;
    const price = getDiscountedPrice(itemUnitPrice, discountType, discountAmount);
    const totalPrice = price * quantity;

    return {
      title: `Every ${frequencyValue} ${intervalUnit}`,
      quantity,
      price,
      totalPrice,
    };
  });

/**
 * CartItemSubscriptionInfo component
 * @param {Object[]} subscriptions ReCharge Subscriptions
 * @param {number} totalQuantity Total cart item quantity
 * @param {string} currency Currency code like USD or EUR
 * @param {number} itemUnitPrice Unit price
 * @param {string} cartItemId Cart item id
 * @return {JSX}
 */
const CartItemSubscriptionInfo = ({
  subscriptions,
  totalQuantity,
  currency,
  itemUnitPrice,
  cartItemId,
}) => {
  if (!Array.isArray(subscriptions)) {
    return null;
  }
  const subscriptionDistillates = distillSubscriptions(subscriptions, itemUnitPrice);

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
       }) => (
         <Label
           currency={currency}
           price={price}
           totalPrice={totalPrice}
           title={title}
           quantity={quantity}
           key={`subscription-${cartItemId}-${title}`}
         />
      ))}
      { totalQuantityOfSubscriptions < totalQuantity &&
        <Label
          currency={currency}
          price={itemUnitPrice}
          totalPrice={(totalQuantity - totalQuantityOfSubscriptions) * itemUnitPrice}
          title="One Time"
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
  subscriptions: PropTypes.arrayOf(PropTypes.shape()),
  totalQuantity: PropTypes.number,
};

CartItemSubscriptionInfo.defaultProps = {
  itemUnitPrice: 0,
  subscriptions: [],
  totalQuantity: 0,
}

export default connect(CartItemSubscriptionInfo);
