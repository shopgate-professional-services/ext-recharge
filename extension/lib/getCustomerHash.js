const ReChargeApi = require('../utilities/ReChargeApi')

module.exports = async (context) => {
  const { userId } = context.meta || {}

  if (!userId) {
    return { customerHash: null }
  }

  const api = new ReChargeApi(context)
  const { customers = [] } = await api.getCustomerByShopifyUserId(userId)

  if (customers.length < 1) {
    return { customerHash: null }
  }
  const { hash = '' } = customers[0] || {}
  return { customerHash: hash }
}
