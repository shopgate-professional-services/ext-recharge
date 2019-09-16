/**
 * Determines if object is empty.
 * @param {Object} obj Object to test
 * @return {boolean}
 */
module.exports = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) { return false }
  }
  return true
}
