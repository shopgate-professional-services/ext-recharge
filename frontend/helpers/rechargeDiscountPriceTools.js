import { DISCOUNT_TYPE_PERCENTAGE } from '../constants';

/**
 * Get discount to price by ReCharge subscription
 * @param {number} price Price
 * @param {string} discountType Discount type
 * @param {number} discountAmount Discount amount in pennies or full percent
 * @return {number}
 */
export const getDiscountToPrice = (price, discountType, discountAmount) => {
  if (!discountAmount || !price || price < 0) {
    return 0;
  }

  // discount amount is in pennies or as full percent so must divide by 100
  const discount = discountAmount / 100;

  if (discountType === DISCOUNT_TYPE_PERCENTAGE) {
    const percentDiscount = price * discount;
    return percentDiscount < price ? percentDiscount : 0;
  }

  return discount < price ? discount : 0;
};

/**
 * Get price discounted by ReCharge subscription
 * @param {number} price Price
 * @param {string} discountType Discount type
 * @param {number} discountAmount Discount amount in pennies or full percent
 * @return {number}
 */
export const getDiscountedPrice = (price, discountType, discountAmount) => {
  if (!discountAmount || !price || price < 0) {
    return price || 0;
  }
  const discountToPrice = getDiscountToPrice(price, discountType, discountAmount);

  return price - discountToPrice;
};
