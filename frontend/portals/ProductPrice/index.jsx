import React from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import RechargeProductPrice from '../../components/RechargeProductPrice';
import connect from './connector';

/**
 * Updates unit price with discounted recharge amount
 * @param {Object} price price
 * @param {string} currentlySelectedFrequency currently selected frequency
 * @param {Object} rechargeInfo recharge info
 * @returns {Object}
 */
const getDiscountedUnitPrice = (price, currentlySelectedFrequency, rechargeInfo) => {
  const rechargeDiscountPercentage = rechargeInfo.find(({ frequencyValue }) =>
    frequencyValue === currentlySelectedFrequency).subscriptionInfo.discountAmount;

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
  rechargeInfo, currentlySelectedFrequency, children, price, optionsPrices,
}) => {
  if (!rechargeInfo || !currentlySelectedFrequency || currentlySelectedFrequency === 'No Subscription') {
    return children;
  }

  const updatedPrice = getDiscountedUnitPrice(price, currentlySelectedFrequency, rechargeInfo);

  return <RechargeProductPrice price={updatedPrice} optionsPrices={optionsPrices} />;
};

ProductPrice.propTypes = {
  children: PropTypes.node.isRequired,
  currentlySelectedFrequency: PropTypes.string,
  optionsPrices: PropTypes.shape(),
  price: PropTypes.shape(),
  rechargeInfo: PropTypes.arrayOf(PropTypes.shape()),
};

ProductPrice.defaultProps = {
  currentlySelectedFrequency: null,
  optionsPrices: null,
  price: null,
  rechargeInfo: null,
};

export default withCurrentProduct(connect(ProductPrice));
