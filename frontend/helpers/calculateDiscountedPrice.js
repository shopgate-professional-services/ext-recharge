import { DISCOUNT_TYPE_PERCENTAGE } from '../constants';

/**
 * Get price discounted by ReCharge subscription
 * @param {number} price Price
 * @param {string} discountType Discount type
 * @param {number} discountAmount Discount amount in pennies or full percent
 * @return {number}
 */
export default (price, discountType, discountAmount) => {
  if (!discountAmount || !price || price < 0) {
    return price || 0;
  }
  // discount amount is in pennies or as full percent so must divide by 100
  const discount = discountAmount / 100;

  if (discountType === DISCOUNT_TYPE_PERCENTAGE) {
    return discount < 1 ? price * (1 - discount) : price;
  }

  if (discount > price) {
    return 0;
  }

  return price - discount;
};
