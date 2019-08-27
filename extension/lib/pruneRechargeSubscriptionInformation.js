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
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'trouble adding recharge subscription data from device storage')
  }

  return { cartItems }
}
