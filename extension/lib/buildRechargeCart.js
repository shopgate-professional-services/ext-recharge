module.exports = async function buildRechargeCart (context, input) {
  if (!input.cartItems.length) {
    return { cart: null }
  }

  console.warn(input.cartItems)

  const isRecharge = input.cartItems.some(
    ({ product }) =>
      product.additionalInfo.some(
        ({ rechargeInfo }) => rechargeInfo))

  if (!isRecharge) {
    return { cart: null }
  }

  return { cart: null }
}
