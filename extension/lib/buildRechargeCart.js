module.exports = async function buildRechargeCart (context, input) {
  if (!input.cartItems.length) {
    return { cart: null }
  }

  const cartItems = input.cartItems.filter(({ type }) => type === 'product')
  const isRecharge = cartItems.some(
    ({ product }) =>
      product.additionalInfo.some(
        ({ recharge }) => recharge))

  if (!isRecharge) {
    return { cart: null }
  }

  const tax = input.totals.find(({ type }) => type === 'tax')
  const discounts = input.totals.filter(({ type }) => type === 'discount')
  let totalAmount = input.totals.find(({ type }) => type === 'grandTotal').amount

  const items = cartItems.map((cartItem) => {
    const product = cartItem.product
    const rechargeInfo = product.additionalInfo.find(({ recharge }) => recharge) || null
    const shopifyVariantId = product.additionalInfo.find(({ shopifyVariantId }) => shopifyVariantId) || null
    const { subscriptionInfo } = rechargeInfo.recharge[0]
    console.warn(subscriptionInfo)
    if (!rechargeInfo) {
      return {
        name: product.name,
        reference: cartItem.id,
        total_amount: product.price.unit * cartItem.quantity,
        unit_price: product.price.unit,
        quantity: cartItem.quantity,
        image_url: product.featuredImageUrl ? product.featuredImageUrl : undefined,
        properties: product.properties.map(({ label: key, value }) => ({ key, value })),
        shopifyVariantId
      }
    }

    const discountPercentage = subscriptionInfo.discountAmount || null

    if (discountPercentage) {
      const deductedPrice = product.price.unit - (product.price.unit * (discountPercentage / 100))
      totalAmount = updateTotalAmount(totalAmount, product.price.unit, deductedPrice)

      return {
        name: product.name,
        reference: cartItem.id,
        total_amount: deductedPrice * cartItem.quantity,
        unit_price: deductedPrice,
        quantity: cartItem.quantity,
        image_url: product.featuredImageUrl ? product.featuredImageUrl : undefined,
        properties: product.properties.map(({ label: key, value }) => ({ key, value })),
        shopifyVariantId,
        subscriptionInfo
      }
    }

    return {
      name: product.name,
      reference: cartItem.id,
      total_amount: product.price.unit * cartItem.quantity,
      unit_price: product.price.unit,
      quantity: cartItem.quantity,
      image_url: product.featuredImageUrl ? product.featuredImageUrl : undefined,
      properties: product.properties.map(({ label: key, value }) => ({ key, value })),
      shopifyVariantId,
      subscriptionInfo
    }
  })

  const cart = {
    order_reference: input.cartId,
    currency: input.currency,
    total_amount: totalAmount,
    tax_amount: tax ? tax.amount * 100 : undefined,
    items,
    discounts: discounts.map((d) => ({
      amount: Math.abs(d.amount * 100),
      description: d.label
    }))
  }

  return { cart }
}

const updateTotalAmount = (totalAmount, price, deductedPrice) => ((totalAmount - price) + deductedPrice)
