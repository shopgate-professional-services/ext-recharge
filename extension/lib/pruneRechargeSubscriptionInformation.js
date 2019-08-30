const isObjectEmpty = require('../helpers/isObjectEmpty')
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

    if (!rechargeSubscriptionInfo || isObjectEmpty(rechargeSubscriptionInfo)) {
      return { cartItems }
    }

    cartItems.forEach(({ product }) => {
      if (!product || !product.id || !rechargeSubscriptionInfo[product.id]) {
        return
      }
      product.additionalInfo.push({ recharge: rechargeSubscriptionInfo[product.id] })
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
  const newData = {}
  let updateNeeded = false
  const cartItemProductIds = cartItems
    .filter(({ product }) => !!product && typeof product === 'object')
    .map(({ product }) => product.id)
  Object.keys(rechargeSubscriptionInfo).forEach((key) => {
    if (cartItemProductIds.includes(key)) {
      newData[key] = rechargeSubscriptionInfo[key]
      return
    }
    updateNeeded = true
  })

  if (!updateNeeded) {
    return
  }

  if (isObjectEmpty(newData)) {
    await context.storage.device.del(RECHARGE_MIRROR_KEY)
    return
  }

  await context.storage.device.set(RECHARGE_MIRROR_KEY, newData)
}
