import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PdpReCharge extends Component {
  static propTypes = {
  };

  static defaultProps = {
  };

  componentWillReceiveProps (nextProps, nextContext) {

    // Pseudo code

    if (nextProps.product) {


      if (!nextProps.product.flags.hasVariants) {
        this.props.dispatch(fetchSubscriptionProducts([nextProps.product.id]));
      } else {

        if (nextProps.variants) {


          const variantIds = nextProps.variants.map((id) => id)

          this.props.dispatch(fetchSubscriptionProducts(variantIds));


        }


      }
    }

  }

  render() {
   return null;
  }
}

export default connect(PdpReCharge);
