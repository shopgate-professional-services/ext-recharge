/**
 * Determine if user is logged in
 * @param {Object} context Extension context
 * @return {boolean}
 */
module.exports = (context) => {
  const { meta: { userId } } = context
  return !!userId
}
