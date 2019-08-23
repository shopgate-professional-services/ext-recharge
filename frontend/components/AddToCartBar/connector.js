import { connect } from 'react-redux';
import {
  hasProductVariants,
  isProductOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isProductPageLoading } from '@shopgate/pwa-common-commerce/product/selectors/page';
import { getCurrentlySelectedFrequency, getSelectedSubscriptionsInfo } from '../../selectors';
import { updateRechargeInfoReducer } from '../../actions';
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
  rechargeInfo: getSelectedSubscriptionsInfo(state, props),
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
  updateRechargeInfoReducer: (currentlySelectedFrequency, recharge) => {
    dispatch(updateRechargeInfoReducer(
      props.productId,
      currentlySelectedFrequency,
      recharge
    ));
  },
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.disabled !== next.disabled) {
    return false;
  }

  if (prev.loading !== next.loading) {
    return false;
  }

  if (prev.currentlySelectedFrequency !== next.currentlySelectedFrequency) {
    return false;
  }

  if (prev.rechargeInfo !== next.rechargeInfo) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });