const ReChargeApi = require('../utilities/ReChargeApi')

const STORAGE_KEY = 'recharge.customer'

module.exports = async (context) => {
  const { userId } = context.meta || {}
  if (!userId) {
    return { customer: null }
  }

  const CACHE_TIME = context.config.cacheTimeCustomer
  const cache = await context.storage.user.get(STORAGE_KEY)

  // return cached ReCharge user
  if (cache && cache.customer && cache.created && (cache.created + CACHE_TIME) > Date.now()) {
    return {
      customer: cache.customer
    }
  }

  const api = new ReChargeApi(context)
  const { customers } = await api.getCustomerByShopifyUserId(userId)

  if (!customers || customers.length < 1) {
    // Don't cache errors
    return { customer: null }
  }

  const [customer] = customers

  await context.storage.user.set(STORAGE_KEY, {
    customer,
    created: Date.now()
  })

  return { customer }
}
