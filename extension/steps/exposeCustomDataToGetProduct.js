module.exports = async (context, { products }) => {
  const { customData } = products[0] || {}

  return { rechargeCustomData: customData }
}
