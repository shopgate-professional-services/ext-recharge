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
}
