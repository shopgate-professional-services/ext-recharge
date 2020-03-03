import React from 'react';
import PropTypes from 'prop-types';
import singularizeOrderUnit from '../../../../helpers/singularizeOrderUnit';
import styles from './style';

/**
 * @returns {JSX}
 */
const SheetItem = ({
  item,
  onSelect,
  selected,
  index,
  intervalUnit,
}) => {
  /**
   * @returns {string}
   */
  const getStyle = () => {
    if (selected) {
      return styles.button;
    }

    return styles.button;
  };

  /**
   * Passes value to be used to parent component
   * @param {Object} event The event object
   */
  const handleItemClick = (event) => {
    event.stopPropagation();
    onSelect(event.target.value);
  };

  /**
   * @returns {Object}
   */
  const buildProps = () => ({
    className: getStyle(),
    key: index,
    value: item,
    onClick: handleItemClick,
  });

  const label = singularizeOrderUnit(item, intervalUnit)

  return (
    <button {...buildProps()} aria-selected={selected} role="option">
      {`${item} ${label}`}
    </button>
  );
};

SheetItem.propTypes = {
  index: PropTypes.number.isRequired,
  intervalUnit: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

export default SheetItem;
