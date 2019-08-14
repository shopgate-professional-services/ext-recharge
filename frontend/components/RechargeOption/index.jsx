import React, { Fragment, useState, useCallback } from 'react';
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
  discountAmount,
  discountType,
  frequencyValues,
  intervalUnit,
  purchaseOption,
  shopifyVariantId,
  setSelectedRechargeSubscription,
}) => {
  if (!shopifyVariantId) {
    return null;
  }
  const [showSheet, setShowSheet] = useState(false);
  const [selected, setSelected] = useState(null);
  const [highlight, setHighlight] = useState(false);

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
    const rechargeOptions = {
      frequencyValue,
      discountType,
      discountAmount,
      quantity: 1,
    };
    setSelectedRechargeSubscription(rechargeOptions);
    handleClose();
  };

  const removeSelection = () => {
    setSelected(null);
    setSelectedRechargeSubscription(null);
    handleClose();
  }

  const isSubscriptionOptions = purchaseOption !== REQUIRED_SUBSCRIPTION_TEXT;

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
    const optionalText = isSubscriptionOptions
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
          {isSubscriptionOptions &&
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
  discountAmount: PropTypes.number.isRequired,
  discountType: PropTypes.string.isRequired,
  frequencyValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  intervalUnit: PropTypes.string.isRequired,
  purchaseOption: PropTypes.string.isRequired,
  setSelectedRechargeSubscription: PropTypes.func.isRequired,
  shopifyVariantId: PropTypes.string.isRequired,
};

export default RechargeOption;
