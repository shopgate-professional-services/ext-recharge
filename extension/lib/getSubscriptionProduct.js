const ReChargeApi = require('../utilities/ReChargeApi')

module.exports = async (context, input) => {
  const { productId = null } = input || {}
  if (!productId) {
    return { products: [] }
  }
  const api = new ReChargeApi(context)
  const { products = [] } = await api.getProducts(input.productId)
  return { products }
}
