import React, { useState, useEffect, useCallback, memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import Sheet from './components/Sheet';
import Transition from 'react-transition-group/Transition';
import transition from './transition';
import styles from './style';

/**
 * @param {Object} props props
 * @returns {JSX}
 */
const Options = (props) => {
  const [showSheet, setShowSheet] = useState(false);
  const [selected, setSelected] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  /**
   * @param {string} defaultLabel The default button Recharge Label
   * @returns {string}
   */
  const getButtonLabel = (defaultLabel) => {
    if (!selected) {
      return defaultLabel;
    }
    return null;
  };

  const label = props.required ? 'Subscription Selection' : 'Subscription Selection (optional)';

  const handleOpen = useCallback((event) => {
    event.preventDefault();
    setShowSheet(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowSheet(false);
  }, []);

  /**
   * Renders the transition contents.
   * @param {string} state The current transition state
   * @returns {JSX}
   */
  const transitionRenderer = (state) => {
    const buttonLabel = getButtonLabel('Recharge Subscription');

    return (
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => { }}
        className={styles.button}
        onClick={handleOpen}
        style={transition[state]}
      >
        {selected && <div className={styles.label}>{label}</div>}
        <div className={styles.selection}>{buttonLabel}</div>
      </div>
    );
  };

  return (
    <Fragment>
      <Transition in={highlighted} timeout={500} onEntered={setHighlighted(false)}>
        {transitionRenderer}
      </Transition>
    </Fragment>
  );
};

export default memo(Options);
