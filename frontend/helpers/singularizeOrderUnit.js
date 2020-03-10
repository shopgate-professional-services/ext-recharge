export default (value, intervalUnit) => {
  if (value > 1) {
    return intervalUnit;
  }

  switch (intervalUnit) {
    case 'Days':
      return 'Day';
    case 'Weeks':
      return 'Week';

    case 'Months':
      return 'Month';

    default:
      return intervalUnit;
  }
};
