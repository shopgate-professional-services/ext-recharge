const isObjectEmpty = require('../helpers/isObjectEmpty')
const { RECHARGE_INFO_KEY } = require('../constants')

module.exports = async (context, { cartItems }) => {
  try {
    if (!cartItems || cartItems.length < 1) {
      await context.storage.device.del(RECHARGE_INFO_KEY)
      return { cartItems }
    }
    const rechargeSubscriptionInfo = await context.storage.device.get(RECHARGE_INFO_KEY)
    if (!rechargeSubscriptionInfo || isObjectEmpty(rechargeSubscriptionInfo)) {
      return { cartItems }
    }

    console.warn(cartItems)

    cartItems.forEach(({ product }) => {
      if (!product || !product.id || !rechargeSubscriptionInfo[product.id]) {
        return
      }
      product.additionalInfo.push(rechargeSubscriptionInfo[product.id])
    })
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'trouble adding recharge subscription data from device storage')
  }
  return { cartItems }
}
