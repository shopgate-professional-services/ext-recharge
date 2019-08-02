import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';

/**
 * @returns {JSX}
 */
const PdpRechargeProducts = ({ subscriptionProducts }) => {
  // componentWillReceiveProps(nextProps, nextContext) {

  //   if (nextProps.product) {

  //     if (!nextProps.product.flags.hasVariants) {
  //       this.props.dispatch(fetchSubscriptionProducts([nextProps.product.id]));
  //     } else {

  //       if (nextProps.variants) {

  //         const variantIds = nextProps.variants.map((id) => id)

  //         this.props.dispatch(fetchSubscriptionProducts(variantIds));

  //       }

  //     }
  //   }

  // }
  console.warn(subscriptionProducts);
  return (<div>hi</div>);
};

PdpRechargeProducts.propTypes = {
  subscriptionProducts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default connect(PdpRechargeProducts);
