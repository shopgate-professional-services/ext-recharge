const { getLineIdToProductIdMap } = require('../utilities/lineItemIdToProductMapper')
const { RECHARGE_MIRROR_KEY, RECHARGE_CART_MESSAGES } = require('../constants')
const isLoggedIn = require('../helpers/isLoggedIn')
const isArrayWithElements = require('../helpers/isArrayWithElements')

module.exports = async (context, { cartItems }) => {
  const storage = isLoggedIn(context) ? context.storage.user : context.storage.device
  const cartItemIdToProductIdMap = await getLineIdToProductIdMap(context)
  const rechargeCart = await storage.get(RECHARGE_MIRROR_KEY)

  if (!(cartItemIdToProductIdMap && rechargeCart && cartItems.length)) {
    return { cartItems }
  }

  const messages = []
  const updatedCartItems = cartItems.filter((cartItem) => {
    const hasSubscription = cartItemHasRechargeSubscription(cartItem, rechargeCart, cartItemIdToProductIdMap)

    if (hasSubscription) {
      messages.push(createCartMessage(cartItem, cartItemIdToProductIdMap))
    }

    return !hasSubscription
  })

  if (messages.length) {
    await storage.set(RECHARGE_CART_MESSAGES, messages)
  }

  return { cartItems: updatedCartItems }
}

/**
 * Determine if cart line item has subscription
 * @param {Object} cartItem
 * @param {Object[]} rechargeCart Stored mirror cart
 * @param {Object[]} cartItemIdToProductIdMap Cart line item id to product id map
 * @return {boolean}
 */
const cartItemHasRechargeSubscription = (cartItem, rechargeCart, cartItemIdToProductIdMap) => {
  if (!(isArrayWithElements(rechargeCart) && isArrayWithElements(cartItemIdToProductIdMap))) {
    return false
  }

  const { productId } = cartItemIdToProductIdMap
    .find(map => map.lineItemId === cartItem.cartItemId) || {}

  if (!productId) {
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

/**
 * Create cart message object
 * @param {Object} cartItem Cart item
 * @param {Object[]} cartItemIdToProductIdMap Cart line item id to product id map
 * @return {Object}
 */
const createCartMessage = (cartItem, cartItemIdToProductIdMap) => ({
  type: 'error',
  code: 'EUNKNOWN',
  message: 'recharge.edit_cart_error',
  messageParams: {
    name: getCartItemName(cartItem, cartItemIdToProductIdMap)
  },
  translated: false
})

/**
 * Get product name from cartItemIdToProductIdMap
 * @param {Object} cartItem Cart item
 * @param {Object[]} cartItemIdToProductIdMap Cart line item id to product id map
 * @return {string}
 */
const getCartItemName = (cartItem = {}, cartItemIdToProductIdMap = []) => {
  const { name = '' } = cartItemIdToProductIdMap
    .find(map => map.lineItemId === cartItem.cartItemId) || {}

  return name
}
