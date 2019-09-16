const { getLineIdToProductIdMap } = require('../utilities/lineItemIdToProductMapper')
const { RECHARGE_MIRROR_KEY } = require('../constants')
const isLoggedIn = require('../helpers/isLoggedIn')

module.exports = async (context, { cartItems }) => {
  const storage = isLoggedIn(context) ? context.storage.user : context.storage.device
  const cartItemIdToProductIdMap = await getLineIdToProductIdMap(context)
  const rechargeCart = await storage.get(RECHARGE_MIRROR_KEY)

  if (!(cartItemIdToProductIdMap && rechargeCart)) {
    return
  }

  const updateLineItems = cartItems.map(item => item.cartItemId)

  const hasSubscription = cartItemIdToProductIdMap
    .some(({ lineItemId, productId }) => (
      updateLineItems.includes(lineItemId) &&
      rechargeCartHasSubscriptionProduct(productId, rechargeCart)
    ))

  if (hasSubscription) {
    throw new Error('It is not possible to update products with subscriptions. You may remove the item or add more from the product detail page')
  }
}

/**
 * Determine if product id is in mirror cart and that mirror product has at least one subscription selection
 * @param {string} productId Product id
 * @param {Object[]} rechargeCart Stored mirror cart
 * @return {boolean}
 */
const rechargeCartHasSubscriptionProduct = (productId, rechargeCart) => {
  if (!(Array.isArray(rechargeCart) && rechargeCart.length)) {
    return false
  }
  const rechargeProduct = rechargeCart
    .find(product => product.productId === productId || product.baseProductId === productId)

  if (!rechargeProduct) {
    return false
  }
  const { selections = [] } = rechargeProduct

  return selections.some(selection => !!selection.subscriptionInfo)
}
