import React, { Fragment, Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { RouteContext } from '@shopgate/pwa-common/context';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import * as constants from './constants';
import AddToCartButton from './components/AddToCartButton';
import AddMoreButton from './components/AddMoreButton';
import CartItemsCount from './components/CartItemsCount';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartBar component.
 */
class AddToCartBar extends Component {
  static propTypes = {
    conditioner: PropTypes.shape().isRequired,
    isRechargeOptional: PropTypes.bool.isRequired,
    options: PropTypes.shape().isRequired,
    productId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    visible: PropTypes.bool.isRequired,
    addToCart: PropTypes.func,
    chooseSubscriptionAlert: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    rechargeInfo: PropTypes.shape(),
    subscriptionItemsFetching: PropTypes.bool,
  };

  static defaultProps = {
    addToCart: () => { },
    chooseSubscriptionAlert: () => { },
    disabled: false,
    loading: false,
    rechargeInfo: null,
    subscriptionItemsFetching: true,
  };

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.target = document.getElementById('AppFooter');
    this.state = {
      clicked: false,
      visible: true,
      added: 0,
    };

    this.ref = React.createRef();
    this.moreButtonRef = React.createRef();

    UIEvents.addListener(constants.SHOW_ADD_TO_CART_BAR, this.handleShow);
    UIEvents.addListener(constants.HIDE_ADD_TO_CART_BAR, this.handleHide);
    UIEvents.addListener(constants.INCREMENT_ACTION_COUNT, this.handleIncrement);
    UIEvents.addListener(constants.DECREMENT_ACTION_COUNT, this.handleDecrement);
    UIEvents.addListener(constants.RESET_ACTION_COUNT, this.handleReset);
  }

  /**
   * Unregisters the ui events.
   */
  componentWillUnmount() {
    UIEvents.removeListener(constants.SHOW_ADD_TO_CART_BAR, this.handleShow);
    UIEvents.removeListener(constants.HIDE_ADD_TO_CART_BAR, this.handleHide);
    UIEvents.removeListener(constants.INCREMENT_ACTION_COUNT, this.handleIncrement);
    UIEvents.removeListener(constants.DECREMENT_ACTION_COUNT, this.handleDecrement);
    UIEvents.removeListener(constants.RESET_ACTION_COUNT, this.handleReset);
  }

  handleShow = () => {
    this.setState({ visible: true });
  }

  handleHide = () => {
    this.setState({ visible: false });
  }

  /**
   * @param {number} count count
   */
  handleIncrement = (count) => {
    this.setState(prevState => ({
      added: (prevState.added + count),
    }));
  }

  /**
   * @param {number} count count
   */
  handleDecrement = (count) => {
    this.setState(prevState => ({
      added: (prevState.added > 0 ? prevState.added - count : 0),
    }));
  }

  handleReset = () => {
    this.setState({ added: 0 });
  }

  /**
   * Handles the button click.
   * Checks if the button can be clicked and if
   * all criteria set by the conditioner are met.
   */
  handleAddToCart = () => {
    if (this.state.clicked) {
      return;
    }

    if (this.props.loading || this.props.disabled) {
      return;
    }

    if (this.props.subscriptionItemsFetching) {
      return;
    }

    if (this.props.disabled || (
      !this.props.disabled
      &&
      !this.props.isRechargeOptional
      && !this.props.rechargeInfo
    )) {
      this.props.chooseSubscriptionAlert();
      return;
    }

    this.props.conditioner.check().then((fullfilled) => {
      if (!fullfilled) {
        return;
      }

      this.setState({ clicked: true });

      this.props.addToCart({
        productId: this.props.productId,
        options: this.props.options,
        quantity: this.props.quantity,
      });

      if (this.moreButtonRef.current) {
        this.moreButtonRef.current.focus();
      }

      setTimeout(this.resetClicked, 250);
    });
  }

  resetClicked = () => {
    this.setState({ clicked: false });
  }

  /**
   * @return {JSX}
   */
  render() {
    if (this.state.visible === false) {
      return null;
    }

    const { added } = this.state;

    if (!this.props.visible) {
      return null;
    }

    return ReactDOM.createPortal(
      (
        <Fragment>
          <div className={styles.container} >
            <div className={styles.innerContainer} ref={this.ref}>
              <div className={styles.base}>
                <div className={styles.statusBar}>
                  <CartItemsCount itemCount={added} />
                  <AddMoreButton
                    handleAddToCart={this.handleAddToCart}
                    disabled={this.props.disabled}
                    loading={this.props.loading}
                    onReset={this.resetClicked}
                    visible={added > 0}
                    ref={this.moreButtonRef}
                  />
                </div>
                <AddToCartButton
                  disabled={this.props.disabled}
                  itemCount={added}
                  handleAddToCart={this.handleAddToCart}
                  onReset={this.resetClicked}
                />
              </div>
            </div>
          </div>
        </Fragment>
      ),
      this.target
    );
  }
}

export default connect(props => (
  <RouteContext.Consumer>
    {({ visible }) => (
      <AddToCartBar {...props} visible={visible} />
    )}
  </RouteContext.Consumer>
));
