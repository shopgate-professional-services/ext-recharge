import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FloatingActionButton } from '@shopgate/pwa-ui-material';
import IndicatorCircle from '@shopgate/pwa-ui-shared/IndicatorCircle';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { I18n } from '@shopgate/engage/components';
import Icon from './components/Icon';
import connect from './connector';
import { button, hidden } from './style';

const { colors } = themeConfig;

/**
 * @returns {JSX}
 */
const AddToCartCTA = ({
  addToCart,
  conditioner,
  currentlySelectedFrequency,
  disabled,
  isRechargeOptional,
  loading,
  options,
  productId,
  quantity,
  rechargePDPInfo,
  subscriptionItemsFetching,
  updateRechargePDPInfoReducer,
}) => {
  const [clicked, setClicked] = useState(false);

  /**
   * Reset the state to make the button clickable again.
   */
  const resetClicked = () => {
    setClicked(false);
  };

  /**
   * Gets button color to use.
   * @returns {Object}
   */
  const getColor = () => {
    if (clicked) {
      return colors.light;
    }
    if (subscriptionItemsFetching) {
      return colors.shade5;
    }
    if (!isRechargeOptional) {
      return (!disabled && !loading && !currentlySelectedFrequency)
        ? colors.shade5 : colors.primary;
    }
    return (disabled && !loading) ? colors.shade5 : colors.primary;
  };

  /**
 * Gets Icon to use
 * @returns {JSX}
 */
  const getIcon = () => {
    if (loading) {
      return (
        <IndicatorCircle
          color={colors.primaryContrast}
          strokeWidth={4}
          paused={false}
        />
      );
    }

    return <Icon success={clicked} onSuccess={resetClicked} />;
  };

  /**
* Handles the button click.
* Checks if the button can be clicked and if
* all criteria set by the conditioner are met.
*/
  const handleClick = () => {
    if (clicked) {
      return;
    }

    if (disabled || (!disabled && !isRechargeOptional && !currentlySelectedFrequency)) {
      return;
    }

    conditioner.check().then((fulfilled) => {
      if (!fulfilled) {
        return;
      }

      setClicked(true);

      if (currentlySelectedFrequency) {
        const index = rechargePDPInfo.findIndex(val =>
          val.frequencyValue === currentlySelectedFrequency);

        const selectedSubscriptionInfo = rechargePDPInfo.splice(index, 1);
        const toIncrement = selectedSubscriptionInfo[0].subscriptionInfo.quantity + quantity;

        const subscriptionInfo = {
          ...selectedSubscriptionInfo[0].subscriptionInfo,
          quantity: toIncrement,
        };
        rechargePDPInfo.push({
          ...selectedSubscriptionInfo[0], subscriptionInfo,
        });

        updateRechargePDPInfoReducer(currentlySelectedFrequency, rechargePDPInfo);
      }

      addToCart({
        productId,
        options,
        quantity,
      });
    });
  };
  return (
    <FloatingActionButton
      background={getColor()}
      className={button}
      onClick={handleClick}
    >
      <I18n.Text string="product.add_to_cart" className={hidden} />
      {getIcon()}
    </FloatingActionButton>
  );
};

AddToCartCTA.propTypes = {
  addToCart: PropTypes.func.isRequired,
  conditioner: PropTypes.shape().isRequired,
  disabled: PropTypes.bool.isRequired,
  isRechargeOptional: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  updateRechargePDPInfoReducer: PropTypes.func.isRequired,
  currentlySelectedFrequency: PropTypes.string,
  rechargePDPInfo: PropTypes.arrayOf(PropTypes.shape()),
  subscriptionItemsFetching: PropTypes.bool,
};

AddToCartCTA.defaultProps = {
  currentlySelectedFrequency: null,
  rechargePDPInfo: null,
  subscriptionItemsFetching: true,
};

export default connect(AddToCartCTA);
