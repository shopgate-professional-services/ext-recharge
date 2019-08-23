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
  let orderIntervalUnit = null
  return items.map((item) => {
    const { subscriptionInfo } = item || null
    const { shopifyVariantId } = item || null
    if (subscriptionInfo) {
      switch (subscriptionInfo.intervalUnit) {
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
      if (subscriptionInfo.orderDayOfMonth === 0) {
        subscriptionInfo.orderDayOfMonth = null
      }
    }
    if (subscriptionInfo) {
      return ({
        charge_interval_frequency: subscriptionInfo.chargeIntervalFrequency,
        cutoff_day_month: subscriptionInfo.cutoffDayOfMonth,
        cutoff_day_week: subscriptionInfo.cutoffDayOfWeek,
        expire_after_specific_number_of_charges: subscriptionInfo.expireAfterSpecificNumberOfCharges,
        order_day_of_month: subscriptionInfo.orderDayOfMonth,
        order_day_of_week: subscriptionInfo.orderDayOfWeek,
        order_interval_frequency: subscriptionInfo.orderIntervalFrequency,
        order_interval_unit: orderIntervalUnit,
        price: item.unit_price,
        quantity: item.quantity,
        variant_id: subscriptionInfo.shopifyVariantId
      })
    }
    return ({
      quantity: item.quantity,
      price: item.unit_price,
      variant_id: shopifyVariantId
    })
  })
}
