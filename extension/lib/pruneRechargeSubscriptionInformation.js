const { saveLineIdToProductIdMap } = require('../utilities/lineItemIdToProductMapper')
const { RECHARGE_MIRROR_KEY } = require('../constants')

module.exports = async (context, { cartItems }) => {
  try {
    if (!cartItems || cartItems.length < 1) {
      await context.storage.device.del(RECHARGE_MIRROR_KEY)
      return { cartItems }
    }

    // save line item id to product id for update enforcement
    await saveLineIdToProductIdMap(context, cartItems)

    const rechargeSubscriptionInfo = await context.storage.device.get(RECHARGE_MIRROR_KEY)

    if (!(Array.isArray(rechargeSubscriptionInfo) && rechargeSubscriptionInfo.length > 0)) {
      return { cartItems }
    }

    cartItems
      .forEach(({ product }) => {
        if (!(product && typeof product === 'object' && product.id)) {
          return
        }

        const { selections } = rechargeSubscriptionInfo.find(({ productId, baseProductId }) => (
          product.id === productId || product.id === baseProductId
        )) || {}

        if (selections) {
          product.additionalInfo.push({recharge: selections})
        }
      })

    await editOutOldSubscriptionInfo(rechargeSubscriptionInfo, cartItems, context)
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'trouble adding recharge subscription data from device storage')
  }
  return { cartItems }
}

/**
 * Remove items from mirror cart that are no longer in actual shopping cart
 * @param {Object} rechargeSubscriptionInfo
 * @param {Object[]} cartItems
 * @param {Object} context
 * @return {Promise<void>}
 */
const editOutOldSubscriptionInfo = async (rechargeSubscriptionInfo, cartItems, context) => {
  const cartItemProductIds = cartItems
    .filter(({ product }) => !!product && typeof product === 'object')
    .map(({ product }) => product.id)

  const newData = rechargeSubscriptionInfo.filter(({ productId, baseProductId }) => (
    cartItemProductIds.includes(productId) || cartItemProductIds.includes(baseProductId)
  ))

  if (rechargeSubscriptionInfo.length === newData.length) {
    return
  }

  if (!newData.length) {
    await context.storage.device.del(RECHARGE_MIRROR_KEY)
    return
  }

  await context.storage.device.set(RECHARGE_MIRROR_KEY, newData)
}
