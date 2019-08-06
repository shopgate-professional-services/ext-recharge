import React, { Fragment, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { withCurrentProduct } from '@shopgate/engage/core';
import RechargeOptions from '../../components/RechargeOptions';
import connect from './connector';

/**
 * @returns {JSX}
 */
const PdpRechargeProducts = ({
  baseProductId,
  productId,
  variantId,
  subscriptionProducts,
  fetchSubscriptionProducts,
}) => {
  useEffect(() => {
    fetchSubscriptionProducts(baseProductId);
  }, [baseProductId]);

  console.warn('subscriptionProducts: ', subscriptionProducts);

  return (
    <Fragment>
      {
        subscriptionProducts ?
          <RechargeOptions subscriptionProducts={subscriptionProducts} /> : null
      }
    </Fragment>
  );
};
PdpRechargeProducts.propTypes = {
  baseProductId: PropTypes.string.isRequired,
  fetchSubscriptionProducts: PropTypes.func.isRequired,
  productId: PropTypes.string.isRequired,
  subscriptionProducts: PropTypes.arrayOf(PropTypes.shape()),
  variantId: PropTypes.string,
};

PdpRechargeProducts.defaultProps = {
  subscriptionProducts: null,
  variantId: null,
};

export default withCurrentProduct(connect(memo(PdpRechargeProducts)));
