export default (orderIntervalFrequencyOptions) => {
  if (orderIntervalFrequencyOptions.length > 1) {
    return false;
  }

  return true;
}