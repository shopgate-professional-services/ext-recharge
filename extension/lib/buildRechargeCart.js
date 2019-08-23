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
  let grandTotal = input.totals.find(({ type }) => type === 'grandTotal').amount
  let discounted = false

  const items = []
  cartItems.forEach((cartItem) => {
    const product = cartItem.product
    const rechargeInfo = product.additionalInfo.find(({ recharge }) => recharge) || null
    const { shopifyVariantId } = product.additionalInfo.find(({ shopifyVariantId }) => shopifyVariantId) || {}
    // Should be used to add non recharge applicable products - need the shopfiy variant_id to create a recharge checkout line item
    if (!rechargeInfo) {
      items.push({
        order_reference: cartItem.id,
        name: product.name,
        reference: cartItem.id,
        total_amount: product.price.unit * cartItem.quantity,
        unit_price: product.price.unit,
        quantity: cartItem.quantity,
        image_url: product.featuredImageUrl ? product.featuredImageUrl : undefined,
        properties: product.properties.map(({ label: key, value }) => ({ key, value })),
        shopifyVariantId
      })
      return
    }

    // should be used to add recharge applicable items based on selected or non selected subscription.
    const mappedSubscriptions = rechargeInfo.recharge.map((info) => {
      const { subscriptionInfo } = info || null
      const { frequencyValue } = info || null
      const { shopifyVariantId } = subscriptionInfo || null

      if (frequencyValue === 'No Subscription') {
        return {
          order_reference: cartItem.id,
          name: product.name,
          reference: cartItem.id,
          total_amount: product.price.unit * subscriptionInfo.quantity,
          unit_price: product.price.unit,
          quantity: subscriptionInfo.quantity,
          image_url: product.featuredImageUrl ? product.featuredImageUrl : undefined,
          properties: product.properties.map(({ label: key, value }) => ({ key, value })),
          shopifyVariantId
        }
      }

      const discountPercentage = subscriptionInfo.discountAmount || null
      if (discountPercentage) {
        const deductedPrice = product.price.unit - (product.price.unit * (discountPercentage / 100))

        discounted = true

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
