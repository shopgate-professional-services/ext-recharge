import React, { Fragment, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import { i18n } from '@shopgate/engage/core';
import { SheetDrawer, SheetList } from '@shopgate/engage/components';
import SheetItem from './components/SheetItem';
import {
  REQUIRED_SUBSCRIPTION_TEXT,
  REQUIRED_SUBSCRIPTION_LABEL,
  OPTIONAL_SUBSCRIPTION_LABEL,
} from '../../constants';
import transition from './transition';
import styles from './style';
/**
 * @returns {JSX}
 */
const RechargeOption = ({
  id,
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
      shopifyVariantId,
      frequencyValue,
      discountType,
      discountAmount,
      quantity: 1,
    };
    setSelectedRechargeSubscription(rechargeOptions);
    handleClose();
  };

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
    const label = purchaseOption === REQUIRED_SUBSCRIPTION_TEXT ?
      REQUIRED_SUBSCRIPTION_LABEL : OPTIONAL_SUBSCRIPTION_LABEL;

    const translatedLabel = i18n.text('product.pick_an_attribute', [label]);
    const buttonLabel = getButtonLabel(translatedLabel);

    return (
      <div
        role="button"
        className={styles.button}
        onKeyDown={() => { }}
        tabIndex={0}
        onClick={handleOpen}
        style={transition[state]}
      >
        {selected && <div className={styles.label}>{label}</div>}
        <div className={styles.selection}>{buttonLabel}</div>
      </div>
    );
  };

  const label = purchaseOption === REQUIRED_SUBSCRIPTION_TEXT ?
    REQUIRED_SUBSCRIPTION_LABEL : OPTIONAL_SUBSCRIPTION_LABEL;
  const translatedLabel = i18n.text('product.pick_an_attribute', [label]);

  return (
    <Fragment>
      <Transition in={highlight} timeout={500} onEntered={removeHighlight}>
        {transitionRenderer}
      </Transition>
      <SheetDrawer
        isOpen={showSheet}
        title={translatedLabel}
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
        </SheetList>
      </SheetDrawer>
    </Fragment>
  );
};

RechargeOption.propTypes = {
  discountAmount: PropTypes.number.isRequired,
  discountType: PropTypes.string.isRequired,
  frequencyValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.number.isRequired,
  intervalUnit: PropTypes.string.isRequired,
  purchaseOption: PropTypes.string.isRequired,
  setSelectedRechargeSubscription: PropTypes.func.isRequired,
  shopifyVariantId: PropTypes.string.isRequired,
};

export default RechargeOption;
