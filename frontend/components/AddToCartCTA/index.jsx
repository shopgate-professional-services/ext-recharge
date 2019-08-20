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
  isRechargeOptional,
  productId,
  options,
  conditioner,
  disabled,
  loading,
  addToCart,
  quantity,
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

    if (disabled) {
      return;
    }

    conditioner.check().then((fulfilled) => {
      if (!fulfilled) {
        return;
      }

      setClicked(true);

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
};

export default connect(AddToCartCTA);
