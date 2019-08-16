const RechargeApi = require('../utilities/ReChargeApi')

module.exports = async (context, { cart }) => {
  if (!cart) {
    return { cartToken: null }
  }
  const checkoutParams = {
    lineItems: createLineItems(cart.items)
  }
  const api = new RechargeApi(context)
  const response = await api.createOrderToken(checkoutParams)
  const { token } = response.checkout || {}
  return { cartToken: token }
}

const createLineItems = (items) => {
  const lineItems = []
  items.map((item) => {
    const { rechargeInfo } = item || null
    const { shopifyVariantId } = item || null
    if (rechargeInfo) {
      lineItems.push({
        price: item.unit_price,
        variant_id: rechargeInfo.recharge.shopifyVariantId,
        quantity: item.quantity
      })
    }
    if (shopifyVariantId) {
      lineItems.push({
        variant_id: shopifyVariantId,
        quantity: item.quantity
      })
    }
  })
  return lineItems
}
