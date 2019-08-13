const isObjectEmpty = require('../helpers/isObjectEmpty')
const { RECHARGE_INFO_KEY } = require('../constants')

module.exports = async (context, input) => {
  if (!input.products) {
    return {}
  }
  let rechargeSubscriptionInfo = {}

  try {
    rechargeSubscriptionInfo = await context.storage.device.get(RECHARGE_INFO_KEY) || {}
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'coult not get recharge subscription data from device storage')
    return {}
  }

  input.products.forEach((product) => {
    if (!product.metadata || !product.productId) {
      return
    }
    rechargeSubscriptionInfo[product.productId] = metadataTranslation(product.metadata)
  })

  if (isObjectEmpty(rechargeSubscriptionInfo)) {
    return {}
  }

  try {
    await context.storage.device.set(RECHARGE_INFO_KEY, rechargeSubscriptionInfo)
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'could not set recharge subscription data from device storage')
  }
  return {}
}

/**
 * Makes tracking object.
 * @param {Object} recharge recharge subscription info
 * @returns {Object}
 */
const metadataTranslation = ({ recharge }) => (
  {
    rechargeInfo: recharge || false
  }
)
