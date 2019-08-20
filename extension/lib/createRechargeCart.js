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
  let orderIntervalUnit = null
  items.map((item) => {
    const { rechargeInfo } = item || null
    const { shopifyVariantId } = item || null
    if (rechargeInfo) {
      switch (rechargeInfo.recharge.intervalUnit) {
        case 'Days':
          orderIntervalUnit = 'day'
          break
        case 'Weeks':
          orderIntervalUnit = 'week'
          break
        case 'Months':
          orderIntervalUnit = 'month'
          break
        default:
          orderIntervalUnit = null
      }
      if (rechargeInfo.recharge.orderDayOfMonth === 0) {
        rechargeInfo.recharge.orderDayOfMonth = null
      }
      lineItems.push({
        charge_interval_frequency: rechargeInfo.recharge.chargeIntervalFrequency,
        cutoff_day_month: rechargeInfo.recharge.cutoffDayOfMonth,
        cutoff_day_week: rechargeInfo.recharge.cutoffDayOfWeek,
        expire_after_specific_number_of_charges: rechargeInfo.recharge.expireAfterSpecificNumberOfCharges,
        order_day_of_month: rechargeInfo.recharge.orderDayOfMonth,
        order_day_of_week: rechargeInfo.recharge.orderDayOfWeek,
        order_interval_frequency: rechargeInfo.recharge.orderIntervalFrequency,
        order_interval_unit: orderIntervalUnit,
        price: item.unit_price,
        quantity: item.quantity,
        variant_id: rechargeInfo.recharge.shopifyVariantId
      })
    }
    if (shopifyVariantId) {
      lineItems.push({
        quantity: item.quantity,
        variant_id: shopifyVariantId
      })
    }
  })
  console.warn(lineItems)
  return lineItems
}
