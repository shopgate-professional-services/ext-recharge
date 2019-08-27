import React from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import RechargeProductPrice from '../../components/RechargeProductPrice';
import connect from './connector';

/**
 * Updates unit price with discounted recharge amount
 * @param {Object} price price
 * @param {Object} rechargeInfo recharge info
 * @returns {Object}
 */
const getDiscountedUnitPrice = (price, rechargeInfo) => {
  const rechargeDiscountPercentage = rechargeInfo.subscriptionInfo.discountAmount;

  if (!rechargeDiscountPercentage) {
    return price;
  }

  const { unitPrice } = price;

  const updatedPrice = {
    ...price,
    unitPrice: unitPrice - (unitPrice * (rechargeDiscountPercentage / 100)),
  };
  return (updatedPrice);
};
/**
 * @returns {JSX}
 */
const ProductPrice = ({
  rechargeInfo, children, price, optionsPrices,
}) => {
  if (!rechargeInfo || rechargeInfo.frequencyValue === 'No Subscription') {
    return children;
  }

  const updatedPrice = getDiscountedUnitPrice(price, rechargeInfo);

  return <RechargeProductPrice price={updatedPrice} optionsPrices={optionsPrices} />;
};

ProductPrice.propTypes = {
  children: PropTypes.node.isRequired,
  optionsPrices: PropTypes.shape(),
  price: PropTypes.shape(),
  rechargeInfo: PropTypes.shape(),
};

ProductPrice.defaultProps = {
  optionsPrices: null,
  price: null,
  rechargeInfo: null,
};

export default withCurrentProduct(connect(ProductPrice));
