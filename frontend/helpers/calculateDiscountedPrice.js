import { DISCOUNT_TYPE_PERCENTAGE } from '../constants';

export default (price, discountType, discountAmount) => {
  if (!discountAmount || !price || price < 0) {
    return price || 0;
  }
  // discount amount is in pennies or as full percent must divide by 100
  const discount = discountAmount / 100;

  if (discountType === DISCOUNT_TYPE_PERCENTAGE) {
    return discount < 1 ? price * (1 - discount) : price;
  }

  if (discount > price) {
    return 0;
  }

  return price - discount;
};
