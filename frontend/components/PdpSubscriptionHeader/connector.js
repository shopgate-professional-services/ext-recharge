import { connect } from 'react-redux';
import { getProductUnitPrice } from '@shopgate/engage/product';

/**
 * @param {Object} state state
 * @param {Object} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  unitPrice: getProductUnitPrice(state, props),
});

export default connect(mapStateToProps);
