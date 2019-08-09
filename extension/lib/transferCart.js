const RechargeApi = require('../utilities/ReChargeApi')

module.exports = async (context, { cart }) => {
  if (!cart) {
    return { cartToken: null }
  }

  const api = new RechargeApi(context)
  const response = await api.createOrderToken({ cart })
  const { token: cartToken } = response || {}
  return { cartToken }
}
