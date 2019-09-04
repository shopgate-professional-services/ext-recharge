module.exports = async function buildRechargeCart (context, input) {
  if (!input.cartItems.length) {
    return { cart: null }
  }

  const cartItems = input.cartItems.filter(({ type }) => type === 'product')
  // Check if we need to generate a recharge cart
  const isRecharge = cartItems.some(
    ({ product }) =>
      product.additionalInfo.some(
        (val) => {
          const { recharge } = val || {}
          if (recharge) {
            return recharge.some(({ subscriptionInfo }) => subscriptionInfo)
          }
        }
      ))

  if (!isRecharge) {
    return { cart: null }
  }

  const tax = input.totals.find(({ type }) => type === 'tax')
  const discounts = input.totals.filter(({ type }) => type === 'discount')
  const items = []

  cartItems.forEach((cartItem) => {
    const product = cartItem.product
    const { recharge: rechargeInfo } = product.additionalInfo
      .find(({ recharge }) => !!recharge) || {}

    if (!Array.isArray(rechargeInfo)) {
      return
    }

    const mappedSubscriptions = rechargeInfo.map(subOption => {
      const { subscriptionInfo, quantity, shopifyVariantId } = subOption
      const mappedSubscription = {
        order_reference: cartItem.id,
        name: product.name,
        reference: cartItem.id,
        total_amount: product.price.unit * quantity,
        unit_price: product.price.unit,
        quantity: quantity,
        image_url: product.featuredImageUrl ? product.featuredImageUrl : undefined,
        properties: product.properties.map(({ label: key, value }) => ({ key, value })),
        shopifyVariantId
      }

      if (!subscriptionInfo) {
        return mappedSubscription
      }

      // when there is subscriptionInfo the shopifyVariantId and quantity is stored only within it
      mappedSubscription.shopifyVariantId = subscriptionInfo.shopifyVariantId
      mappedSubscription.quantity = subscriptionInfo.quantity
      mappedSubscription.subscriptionInfo = subscriptionInfo
      const discountPercentage = subscriptionInfo.discountAmount || 0

      if (discountPercentage > 0) {
        const deductedPrice = product.price.unit - (product.price.unit * (discountPercentage / 100))
        mappedSubscription.total_amount = deductedPrice * quantity
        mappedSubscription.unit_price = deductedPrice
      }

      return mappedSubscription
    })

    items.push(...mappedSubscriptions)
  })

  const cart = {
    currency: input.currency,
    total_amount: items.reduce((total, item) => item.total_amount + total, 0),
    tax_amount: tax ? tax.amount * 100 : undefined,
    items,
    discounts: discounts.map((d) => ({
      amount: Math.abs(d.amount * 100),
      description: d.label
    }))
  }

  return { cart }
}
