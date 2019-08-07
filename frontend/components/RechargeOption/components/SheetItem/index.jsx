import React from 'react';
import PropTypes from 'prop-types';
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
   *
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

  return (
    <button {...buildProps()} aria-selected={selected} role="option">
      {`${item} ${intervalUnit}`}
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
