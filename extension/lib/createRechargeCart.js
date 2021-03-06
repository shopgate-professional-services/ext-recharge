const RechargeApi = require('../utilities/ReChargeApi')
const isEmptyObject = require('../helpers/isObjectEmpty')

module.exports = async (context, { cart, customer }) => {
  if (!cart) {
    return { rechargeCart: null }
  }

  const { app: { os: { platform = 'connect' } = {} } = {} } = await context.device.getInfo()

  try {
    const checkoutParams = {
      line_items: createLineItems(cart.items),
      ...refineCustomerData(customer),
      /**
       * @link https://support.rechargepayments.com/hc/en-us/articles/360041127093-Using-cart-attributes-and-UTM-parameters-in-URLs
       */
      analytics_data: {
        utm_params: [
          {
            utm_data_source: 'shopgate_connect',
            utm_source: 'shopgate',
            utm_medium: platform,
            utm_timestamp: (new Date()).toISOString().substring(0, 10)
          }
        ]
      },
      // Shopify order / Notes
      note: `Shopgate Connect ${platform}`,
      // Shopify order / Additional details
      note_attributes: [
        {
          name: 'Shopgate connect', // read only
          value: platform // can be changed
        }
      ]
    }

    const api = new RechargeApi(context)
    const response = await api.createOrderToken(checkoutParams)
    const { checkout } = response || {}

    return { rechargeCart: checkout }
  } catch (error) {
    context.log.error(error, 'Error creating recharge cart')
    throw new Error('There was a problem processing the subscription products. Please try again later')
  }
}

const createLineItems = (items) => {
  const translateOrderInterval = interval => {
    return {
      day: 'day',
      days: 'day',
      weeks: 'week',
      week: 'week',
      months: 'month',
      month: 'month'
    }[interval.toLowerCase()] || null
  }

  return items.map((item) => {
    const { subscriptionInfo, shopifyVariantId } = item || {}

    if (!subscriptionInfo) {
      return ({
        quantity: item.quantity,
        price: item.unit_price,
        variant_id: shopifyVariantId
      })
    }

    const rechargeItem = {
      charge_interval_frequency: subscriptionInfo.chargeIntervalFrequency,
      cutoff_day_month: subscriptionInfo.cutoffDayOfMonth,
      cutoff_day_week: subscriptionInfo.cutoffDayOfWeek,
      expire_after_specific_number_of_charges: subscriptionInfo.expireAfterSpecificNumberOfCharges,
      order_day_of_month: subscriptionInfo.orderDayOfMonth === 0 ? null : subscriptionInfo.orderDayOfMonth,
      order_day_of_week: subscriptionInfo.orderDayOfWeek,
      order_interval_frequency: subscriptionInfo.orderIntervalFrequency,
      order_interval_unit: translateOrderInterval(subscriptionInfo.intervalUnit),
      price: item.unit_price,
      quantity: item.quantity,
      variant_id: subscriptionInfo.shopifyVariantId
    }
    // add optional recurring price property if part of Shopgate item
    if (item.recurring_price) {
      rechargeItem.recurring_price = item.recurring_price
    }

    return rechargeItem
  })
}

/**
 * Refine recharge customer into checkout customer data
 * @param {Object} customer
 * @return {Object}
 */
const refineCustomerData = (customer) => {
  const customerData = {}

  if (!(customer && typeof customer === 'object')) {
    return customerData
  }

  if (customer.email) {
    customerData.email = customer.email
  }

  const billingAddressToShippingTranslation = {
    first_name: 'first_name',
    last_name: 'last_name',
    billing_address1: 'address1',
    billing_address2: 'address2',
    billing_zip: 'zip',
    billing_city: 'city',
    billing_company: 'company',
    billing_province: 'province',
    billing_country: 'country',
    billing_phone: 'phone'
  }
  const shippingAddress = {}

  Object.keys(billingAddressToShippingTranslation).forEach((key) => {
    shippingAddress[billingAddressToShippingTranslation[key]] = customer[key] || null
  })

  if (!isEmptyObject(shippingAddress)) {
    customerData.shipping_address = shippingAddress
  }

  return customerData
}
