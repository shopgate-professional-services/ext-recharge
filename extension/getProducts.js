<<<<<<< HEAD
module.exports = async (context, input) => {
  const { apiToken } = context.config

  // TODO: check if input.productIds is !empty

  const request = context.tracedRequest('ShopgateProjectReChargeProducts')

  // TODO: refactor to general API client later

  const params = {
    uri: 'https://api.rechargeapps.com/products',
    qs: {
      shopify_product_ids: input.productIds
    },
    method: 'GET',
    headers: {
      'X-Recharge-Access-Token': apiToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const response = await request(params)
  // TODO: error handling
  console.warn(response)

  return { products: JSON.parse(response).products }
=======
const ReChargeApi = require('./utilities/ReChargeApi')

module.exports = async (context, input) => {
  const { productIds = [] } = input || {}
  if (productIds.length < 1) {
    return { products: [] }
  }
  const api = new ReChargeApi(context)
  const { products = [] } = await api.getProducts(input.productIds)
  return { products }
>>>>>>> CCP-1634-dev
}
