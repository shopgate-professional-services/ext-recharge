import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { i18n } from '@shopgate/engage/core';
import { SheetDrawer, SheetList } from '@shopgate/engage/components';
import SheetItem from './components/SheetItem';
import {
  REQUIRED_SUBSCRIPTION_TEXT,
  DISCOUNT_TYPE_PERCENTAGE,
} from '../../constants';
import transition from './transition';
import styles from './style';
import getConfig from '../../helpers/getConfig';

const { rechargeCurrency } = getConfig();

/**
 * @returns {JSX}
 */
const RechargeOption = ({
  chargeIntervalFrequency,
  cutoffDayOfMonth,
  cutoffDayOfWeek,
  discountAmount,
  discountType,
  expireAfterSpecificNumberOfCharges,
  frequencyValues,
  intervalUnit,
  orderDayOfMonth,
  orderDayOfWeek,
  orderIntervalFrequency,
  purchaseOption,
  selectedSubscriptionsInfo,
  shopifyVariantId,
  updateRechargeInfo,
}) => {
  if (!shopifyVariantId) {
    return null;
  }
  const [showSheet, setShowSheet] = useState(false);
  const [selected, setSelected] = useState(null);
  const [highlight, setHighlight] = useState(false);

  // ComponentWillUnmount - reset selected to null
  useEffect(() => {
    setSelected(null);
    const currentlySelectedFrequency = null;
    updateRechargeInfo(currentlySelectedFrequency, selectedSubscriptionsInfo);
  }, []);

  /**
   * Remove highlight for transitioner
   */
  const removeHighlight = () => {
    setHighlight(false);
  };

  const handleOpen = useCallback((event) => {
    event.preventDefault();
    setShowSheet(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowSheet(false);
  }, []);

  /**
   * @param {string} frequencyValue selected frequencyValue
   */
  const handleSelection = (frequencyValue) => {
    setSelected(frequencyValue);

    const currentlySelectedFrequency = frequencyValue;

    if (!selectedSubscriptionsInfo) {
      const subscriptionInfo = [];
      subscriptionInfo.push({
        frequencyValue,
        subscriptionInfo: {
          chargeIntervalFrequency,
          cutoffDayOfMonth,
          cutoffDayOfWeek,
          discountType,
          discountAmount,
          expireAfterSpecificNumberOfCharges,
          orderDayOfMonth,
          orderDayOfWeek,
          orderIntervalFrequency,
          intervalUnit,
          shopifyVariantId,
          quantity: 0,
        },
      });
      updateRechargeInfo(currentlySelectedFrequency, subscriptionInfo);

      handleClose();

      return;
    }

    const findFreq = selectedSubscriptionsInfo
      .some(arr => arr.frequencyValue === frequencyValue) || false;

    if (!findFreq) {
      selectedSubscriptionsInfo.push({
        frequencyValue,
        subscriptionInfo: {
          chargeIntervalFrequency,
          cutoffDayOfMonth,
          cutoffDayOfWeek,
          discountType,
          discountAmount,
          expireAfterSpecificNumberOfCharges,
          orderDayOfMonth,
          orderDayOfWeek,
          orderIntervalFrequency,
          intervalUnit,
          shopifyVariantId,
          quantity: 0,
        },
      });
      updateRechargeInfo(currentlySelectedFrequency, selectedSubscriptionsInfo);

      handleClose();

      return;
    }

    updateRechargeInfo(currentlySelectedFrequency, selectedSubscriptionsInfo);
    handleClose();
  };

  /**
   * Removes selected recharge subsription
   */
  const removeSelection = () => {
    setSelected(null);
    const currentlySelectedFrequency = null;
    updateRechargeInfo(currentlySelectedFrequency, selectedSubscriptionsInfo);
    handleClose();
  };

  const isSubscriptionOptional = purchaseOption !== REQUIRED_SUBSCRIPTION_TEXT;

  /**
   * Generate Option Label
   * @return {string}
   */
  const generateOptionLabel = () => {
    const intro = i18n.text('recharge.subscription_option.subscription');
    let save = '';
    if (discountAmount > 0) {
      const discount = discountType === DISCOUNT_TYPE_PERCENTAGE
        ? ` ${discountAmount}%`
        : ` ${i18n.price(discountAmount / 100, rechargeCurrency, 2)}`;
      save = ` ${i18n.text('recharge.subscription_option.and_save')} ${discount}`;
    }
    const optionalText = isSubscriptionOptional
      ? ` (${i18n.text('recharge.subscription_option.optional')})` : '';

    return `${intro}${save}${optionalText}`;
  };

  const optionLabel = generateOptionLabel();
  /**
   * @param {string} defaultLabel default recharge label
   * @returns {string}
   */
  const getButtonLabel = (defaultLabel) => {
    if (!selected) {
      return defaultLabel;
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
    const buttonLabel = getButtonLabel(optionLabel);

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
              onSelect={removeSelection}
              selected={false}
            />
          }
        </SheetList>
      </SheetDrawer>
    </Fragment>
  );
};

RechargeOption.propTypes = {
  chargeIntervalFrequency: PropTypes.number.isRequired,
  discountAmount: PropTypes.number.isRequired,
  discountType: PropTypes.string.isRequired,
  frequencyValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  intervalUnit: PropTypes.string.isRequired,
  orderIntervalFrequency: PropTypes.number.isRequired,
  purchaseOption: PropTypes.string.isRequired,
  shopifyVariantId: PropTypes.string.isRequired,
  updateRechargeInfo: PropTypes.func.isRequired,
  cutoffDayOfMonth: PropTypes.number,
  cutoffDayOfWeek: PropTypes.number,
  expireAfterSpecificNumberOfCharges: PropTypes.number,
  orderDayOfMonth: PropTypes.number,
  orderDayOfWeek: PropTypes.number,
  selectedSubscriptionsInfo: PropTypes.arrayOf(PropTypes.shape()),
};

RechargeOption.defaultProps = {
  cutoffDayOfMonth: null,
  cutoffDayOfWeek: null,
  expireAfterSpecificNumberOfCharges: null,
  orderDayOfMonth: null,
  orderDayOfWeek: null,
  selectedSubscriptionsInfo: null,
};

export default RechargeOption;
