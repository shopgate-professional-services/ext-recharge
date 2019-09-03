const ReChargeApi = require('../utilities/ReChargeApi')

module.exports = async (context) => {
  const { userId } = context.meta || {}

  if (!userId) {
    return { customer: null }
  }

  const api = new ReChargeApi(context)
  const { customers = [] } = await api.getCustomerByShopifyUserId(userId)

  if (customers.length < 1) {
    return { customer: null }
  }

  return { customer: customers[0] }
}
