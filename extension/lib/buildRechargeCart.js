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
          const { recharge } = val || null
          if (recharge) {
            return recharge.some(({ frequencyValue }) => frequencyValue)
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
    const rechargeInfo = product.additionalInfo.find(({ recharge }) => recharge).recharge || null
    const mappedSubscriptions = rechargeInfo.map(subOption => {
      if (subOption.subscriptionInfo) {
        const { subscriptionInfo } = subOption || null
        const { shopifyVariantId } = subscriptionInfo || null
        const discountPercentage = subscriptionInfo.discountAmount || null

        if (discountPercentage) {
          const deductedPrice = product.price.unit - (product.price.unit * (discountPercentage / 100))

          return {
            name: product.name,
            reference: cartItem.id,
            total_amount: deductedPrice * subscriptionInfo.quantity,
            unit_price: deductedPrice,
            quantity: subscriptionInfo.quantity,
            image_url: product.featuredImageUrl ? product.featuredImageUrl : undefined,
            properties: product.properties.map(({ label: key, value }) => ({ key, value })),
            shopifyVariantId,
            subscriptionInfo
          }
        }

        return {
          name: product.name,
          reference: cartItem.id,
          total_amount: product.price.unit * subscriptionInfo.quantity,
          unit_price: product.price.unit,
          quantity: subscriptionInfo.quantity,
          image_url: product.featuredImageUrl ? product.featuredImageUrl : undefined,
          properties: product.properties.map(({ label: key, value }) => ({ key, value })),
          shopifyVariantId,
          subscriptionInfo
        }
      }

      const { shopifyVariantId } = subOption || null
      const { quantity } = subOption || null

      return {
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
