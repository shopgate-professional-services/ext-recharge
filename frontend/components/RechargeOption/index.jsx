import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { i18n } from '@shopgate/engage/core';
import { SheetDrawer, SheetList } from '@shopgate/engage/components';
import SheetItem from './components/SheetItem';
import {
  REQUIRED_SUBSCRIPTION_TEXT,
  NO_SUBSCRIPTION_FREQUENCY_VALUE,
} from '../../constants';
import transition from './transition';
import styles from './style';

/**
 * @returns {JSX}
 */
const RechargeOption = ({
  cutoffDayOfMonth,
  cutoffDayOfWeek,
  discountAmount,
  discountType,
  expireAfterSpecificNumberOfCharges,
  frequencyValues,
  intervalUnit,
  orderDayOfMonth,
  orderDayOfWeek,
  purchaseOption,
  shopifyVariantId,
  updateRechargeInfo,
}) => {
  if (!shopifyVariantId) {
    return null;
  }
  const [showSheet, setShowSheet] = useState(false);
  const [selected, setSelected] = useState(null);
  const [highlight, setHighlight] = useState(false);
  const isSubscriptionOptional = purchaseOption !== REQUIRED_SUBSCRIPTION_TEXT;

  // ComponentWillUnmount - reset selected to null
  useEffect(() => {
    setSelected(isSubscriptionOptional ? NO_SUBSCRIPTION_FREQUENCY_VALUE : null);
    setSelected(null);

    const subscriptionInfo = null;

    updateRechargeInfo(subscriptionInfo);
  }, []);

  // ComponentDidUpdate - If shopifyVariantId changed then we reset selected state
  useEffect(() => {
    setSelected(isSubscriptionOptional ? NO_SUBSCRIPTION_FREQUENCY_VALUE : null);
    setSelected(null);

    const subscriptionInfo = null;

    // Ensure meta data value is null
    updateRechargeInfo(subscriptionInfo);
  }, [shopifyVariantId]);

  /**
   * Remove highlight for transitioner
   */
  const removeHighlight = () => {
    setHighlight(false);
  };

  // Opens sheet
  const handleOpen = useCallback((event) => {
    event.preventDefault();
    setShowSheet(true);
  }, []);

  // Closes sheet
  const handleClose = useCallback(() => {
    setShowSheet(false);
  }, []);

  /**
   * @param {string} frequencyValue selected frequencyValue
   */
  const handleSelection = (frequencyValue) => {
    setSelected(frequencyValue);

    // Value attached to pass no selecetd subscription value should
    // not update metaData with null subscriptionInfo
    if (frequencyValue === NO_SUBSCRIPTION_FREQUENCY_VALUE) {
      setSelected(null);
      const subscriptionInfo = null;
      updateRechargeInfo(subscriptionInfo);
      handleClose();
      return;
    }

    // Frequency value is the selected value from sheet
    const subscriptionInfo = {
      frequencyValue,
      subscriptionInfo: {
        chargeIntervalFrequency: frequencyValue,
        cutoffDayOfMonth,
        cutoffDayOfWeek,
        discountType,
        discountAmount,
        expireAfterSpecificNumberOfCharges,
        orderDayOfMonth,
        orderDayOfWeek,
        orderIntervalFrequency: frequencyValue,
        intervalUnit,
        shopifyVariantId,
      },
    };

    // Update metadata needed when adding product to cart
    updateRechargeInfo(subscriptionInfo);

    handleClose();
  };

  const optionLabel = `${i18n.text('recharge.subscription_option.subscription')}${isSubscriptionOptional ? ` (${i18n.text('recharge.subscription_option.optional')})` : ''}`;

  /**
   * @returns {string}
   */
  const getButtonLabel = () => {
    if (!selected) {
      return optionLabel;
    }

    if (selected === NO_SUBSCRIPTION_FREQUENCY_VALUE) {
      return i18n.text('recharge.subscription_option.no_subscription');
    }

    const valueLabel = frequencyValues.find(frequencyValue => frequencyValue === selected);

    return `${valueLabel} ${intervalUnit}`;
  };

  /**
  * Renders the transition contents.
  * @param {string} state The current transition state.
  * @returns {JSX}
  */
  const transitionRenderer = (state) => {
    const buttonLabel = getButtonLabel();

    return (
      <div
        role="button"
        className={styles.button}
        onKeyDown={() => { }}
        tabIndex={0}
        onClick={handleOpen}
        style={transition[state]}
      >
        {selected && <div className={styles.label}>{optionLabel}</div>}
        <div className={styles.selection}>{buttonLabel}</div>
      </div>
    );
  };

  // Adds additional SheetItem for optional subscription products
  return (
    <Fragment>
      <Transition in={highlight} timeout={500} onEntered={removeHighlight}>
        {transitionRenderer}
      </Transition>
      <SheetDrawer
        isOpen={showSheet}
        title={optionLabel}
        onClose={handleClose}
      >
        <SheetList>
          {frequencyValues.map((value, index) => (
            <SheetItem
              intervalUnit={intervalUnit}
              item={value}
              index={index}
              key={index.toString()}
              onSelect={handleSelection}
              selected={value === selected}
            />
          ))}
          {isSubscriptionOptional &&
            <SheetItem
              intervalUnit=""
              item={i18n.text('recharge.subscription_option.no_subscription')}
              index={frequencyValues.length}
              key={frequencyValues.length.toString()}
              onSelect={handleSelection}
              selected={false}
            />
          }
        </SheetList>
      </SheetDrawer>
    </Fragment>
  );
};

RechargeOption.propTypes = {
  discountAmount: PropTypes.number.isRequired,
  discountType: PropTypes.string.isRequired,
  frequencyValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  intervalUnit: PropTypes.string.isRequired,
  purchaseOption: PropTypes.string.isRequired,
  shopifyVariantId: PropTypes.string.isRequired,
  updateRechargeInfo: PropTypes.func.isRequired,
  cutoffDayOfMonth: PropTypes.number,
  cutoffDayOfWeek: PropTypes.number,
  expireAfterSpecificNumberOfCharges: PropTypes.number,
  orderDayOfMonth: PropTypes.number,
  orderDayOfWeek: PropTypes.number,
};

RechargeOption.defaultProps = {
  cutoffDayOfMonth: null,
  cutoffDayOfWeek: null,
  expireAfterSpecificNumberOfCharges: null,
  orderDayOfMonth: null,
  orderDayOfWeek: null,
};

export default RechargeOption;
