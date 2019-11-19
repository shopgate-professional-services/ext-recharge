export default (chargeIntervalFrequency, orderIntervalUnit) => {
  if (chargeIntervalFrequency <= 1) {
    return orderIntervalUnit;
  }

  switch (orderIntervalUnit) {
    case 'day':
      return 'days';
    case 'week':
      return 'weeks';

    case 'month':
      return 'months';
    default:
      return orderIntervalUnit;
  }
};
