const { getLineIdToProductIdMap } = require('../utilities/lineItemIdToProductMapper')
const { RECHARGE_MIRROR_KEY } = require('../constants')

module.exports = async (context, { cartItems }) => {
  const cartItemIdToProductIdMap = await getLineIdToProductIdMap(context)
  const rechargeCart = await context.storage.device.get(RECHARGE_MIRROR_KEY)

  if (!(cartItemIdToProductIdMap && rechargeCart)) {
    return
  }

  const updateLineItems = cartItems.map(item => item.cartItemId)

  const hasSubscription = cartItemIdToProductIdMap
    .some(({ lineItemId, productId }) => (
      updateLineItems.includes(lineItemId) &&
      rechargeCart[productId] &&
      rechargeCart[productId].some(productInfo => !!productInfo.subscriptionInfo)
    ))

  if (hasSubscription) {
    throw new Error('It is not possible to update products with subscriptions. You may remove the item or add more from the product detail page')
  }
}
