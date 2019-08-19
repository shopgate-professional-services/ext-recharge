const RechargeApi = require('../utilities/ReChargeApi')

module.exports = async (context, { cart }) => {
  if (!cart) {
    return { rechargeCart: null }
  }

  const checkoutParams = {
    lineItems: createLineItems(cart.items)
  }
  const api = new RechargeApi(context)
  const response = await api.createOrderToken(checkoutParams)
  const { checkout } = response || {}
  return { rechargeCart: checkout }
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
        quantity: item.quantity,
        order_interval_frequency: rechargeInfo.recharge.orderIntervalFrequency,
        charge_interval_frequency: rechargeInfo.recharge.chargeIntervalFrequency,
        order_interval_unit: rechargeInfo.recharge.intervalUnit === 'Days' ? 'day' : 'month'
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
