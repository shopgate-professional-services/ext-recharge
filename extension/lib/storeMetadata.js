const isObjectEmpty = require('../helpers/isObjectEmpty')
const { RECHARGE_INFO_KEY } = require('../constants')

module.exports = async (context, input) => {
  if (!input.products) {
    return {}
  }
  let rechargeMetaInfo = {}

  try {
    rechargeMetaInfo = await context.storage.device.get(RECHARGE_INFO_KEY) || {}
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'coult not get recharge subscription data from device storage')
    return {}
  }

  input.products.forEach((product) => {
    if (!product.metadata || !product.productId) {
      return
    }
    rechargeMetaInfo[product.productId] = metadataTranslation(product.metadata)
  })

  if (isObjectEmpty(rechargeMetaInfo)) {
    return {}
  }
  try {
    await context.storage.device.set(RECHARGE_INFO_KEY, rechargeMetaInfo)
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
const metadataTranslation = ({ shopifyVariantId, recharge }) => {
  const meta = {}
  if (recharge) {
    meta.recharge = recharge
    return meta
  }
  meta.shopifyVariantId = shopifyVariantId
  return meta
}
