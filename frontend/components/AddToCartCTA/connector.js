import { connect } from 'react-redux';
import {
  hasProductVariants,
  isProductOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isProductPageLoading } from '@shopgate/pwa-common-commerce/product/selectors/page';
import { getCurrentlySelectedFrequency, getSelectedSubscriptionsInfo } from '../../selectors';
import { updateRechargePDPInfoReducer } from '../../actions';
import { addProductToCart } from './actions';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  /**
   * 1. Product has no variants and not orderable
   * 2. Parent product can be not orderable but having orderable variants
   */
  disabled: !isProductOrderable(state, props) && !hasProductVariants(state, props),
  loading: isProductPageLoading(state, props),
  currentlySelectedFrequency: getCurrentlySelectedFrequency(state, props),
  rechargePDPInfo: getSelectedSubscriptionsInfo(state, props),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Function} props The component props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch, props) => ({
  addToCart: (product) => {
    dispatch(addProductToCart(product));
  },
  updateRechargePDPInfoReducer: (currentlySelectedFrequency, recharge) => {
    dispatch(updateRechargePDPInfoReducer(
      props.productId,
      currentlySelectedFrequency,
      recharge
    ));
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
