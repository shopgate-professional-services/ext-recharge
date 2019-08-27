const isObjectEmpty = require('../helpers/isObjectEmpty')
const { RECHARGE_MIRROR_KEY } = require('../constants')

module.exports = async (context, input) => {
  if (!input.products) {
    return {}
  }

  let rechargeMirrorCart = {}

  try {
    rechargeMirrorCart = await context.storage.device.get(RECHARGE_MIRROR_KEY) || {}
  } catch (error) {
    context.log({ errorMessage: error.message }, 'could not get recharge mirrored cart data from device storage')

    return {}
  }

  input.products.forEach((product) => {
    if (!product.metadata || !product.productId) {
      return
    }

    const productMetaData = metadataTranslation(product.metadata)

    // Create array reference if doesn't exist
    if (!rechargeMirrorCart[product.productId]) {
      rechargeMirrorCart[product.productId] = []
    }

    // Copy any existing array reference
    const existingSubscriptionInfo = rechargeMirrorCart[product.productId]

    // If metadata doesn't contain a frequency value, then we only add shopifyVariantId for recharge mirror cart
    if (!productMetaData.frequencyValue) {
      const toIncrement = existingSubscriptionInfo.find(id => id.shopifyVariantId === productMetaData.shopifyVariantId) || null
      if (!toIncrement) {
        productMetaData.quantity = product.quantity

        rechargeMirrorCart[product.productId].push(productMetaData)

        return
      }

      const { quantity } = toIncrement

      toIncrement.quantity = quantity + product.quantity

      return
    }

    const toIncrement = existingSubscriptionInfo.find(subscription => subscription.frequencyValue === productMetaData.frequencyValue) || null

    if (!toIncrement) {
      productMetaData.subscriptionInfo.quantity = product.quantity

      rechargeMirrorCart[product.productId].push(productMetaData)

      return
    }

    const { quantity } = toIncrement.subscriptionInfo

    toIncrement.subscriptionInfo.quantity = quantity + product.quantity
  })

  if (isObjectEmpty(rechargeMirrorCart)) {
    return {}
  }
  try {
    await context.storage.device.set(RECHARGE_MIRROR_KEY, rechargeMirrorCart)
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'could not set recharge subscription data from device storage')
  }

  return {}
}

/**
 * Determines metada being passed.
 * @param {Object} recharge recharge subscription info
 * @returns {Object}
 */
const metadataTranslation = ({ shopifyVariantId, rechargeInfo }) => {
  if (rechargeInfo) {
    const { frequencyValue, subscriptionInfo } = rechargeInfo || null
    const meta = {
      frequencyValue: frequencyValue,
      subscriptionInfo: subscriptionInfo
    }
    return meta
  }
  const meta = { shopifyVariantId: shopifyVariantId }
  return meta
}
