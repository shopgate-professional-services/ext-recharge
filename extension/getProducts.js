const ReChargeApi = require('./utilities/ReChargeApi')

module.exports = async (context, input) => {
  const { productIds = [] } = input || {}
  if (productIds.length < 1) {
    return { products: [] }
  }
  const api = new ReChargeApi(context)
  const products = await api.getProducts(input.productIds)
  return { products }
}
