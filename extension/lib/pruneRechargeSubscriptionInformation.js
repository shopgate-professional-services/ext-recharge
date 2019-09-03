const { saveLineIdToProductIdMap } = require('../utilities/lineItemIdToProductMapper')
const { RECHARGE_MIRROR_KEY } = require('../constants')
const isLoggedIn = require('../helpers/isLoggedIn')
const mergeMirrorCarts = require('../helpers/mergeMirrorCarts')

module.exports = async (context, { cartItems }) => {
  try {
    const storage = isLoggedIn(context) ? context.storage.user : context.storage.device
    if (!cartItems || cartItems.length < 1) {
      await storage.del(RECHARGE_MIRROR_KEY)
      return { cartItems }
    }

    // save line item id to product id for update enforcement
    await saveLineIdToProductIdMap(context, cartItems)

    const rechargeSubscriptionInfo = await getMirrorCart(context)

    if (!(Array.isArray(rechargeSubscriptionInfo) && rechargeSubscriptionInfo.length > 0)) {
      return { cartItems }
    }

    cartItems
      .forEach(({ product }) => {
        if (!(product && typeof product === 'object' && product.id)) {
          return
        }

        const { selections } = rechargeSubscriptionInfo.find(({ productId, baseProductId }) => (
          product.id === productId || product.id === baseProductId
        )) || {}

        if (selections) {
          product.additionalInfo.push({recharge: selections})
        }
      })

    await editOutOldSubscriptionInfo(rechargeSubscriptionInfo, cartItems, storage)
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'trouble adding recharge subscription data from device storage')
  }
  return { cartItems }
}

/**
 * Get mirror cart from user or device storage based on if the user is logged in.
 * Merge an existing recharge cart stored in device storage into an existing user recharge cart
 * Purge an existing cart that is stored in device storage if user is logged in.
 * @param {Object} context Extension context object
 * @return {Promise<*[]|*>}
 */
const getMirrorCart = async (context) => {
  const deviceMirrorCart = await context.storage.device.get(RECHARGE_MIRROR_KEY)
  if (!isLoggedIn(context)) {
    return deviceMirrorCart
  }
  const userMirrorCart = await context.storage.user.get(RECHARGE_MIRROR_KEY)
  // if user is logged in the mirror cart in device storage should be purged
  if (Array.isArray(deviceMirrorCart) && deviceMirrorCart.length) {
    await context.storage.device.del(RECHARGE_MIRROR_KEY)
  }

  if (Array.isArray(deviceMirrorCart) &&
    deviceMirrorCart.length &&
    Array.isArray(userMirrorCart) &&
    userMirrorCart.length) {
    return mergeMirrorCarts(userMirrorCart, deviceMirrorCart)
  }

  return userMirrorCart || deviceMirrorCart
}

/**
 * Remove items from mirror cart that are no longer in actual shopping cart
 * @param {Object} rechargeSubscriptionInfo
 * @param {Object[]} cartItems
 * @param {Object} storage Context storage
 * @return {Promise<void>}
 */
const editOutOldSubscriptionInfo = async (rechargeSubscriptionInfo, cartItems, storage) => {
  const cartItemProductIds = cartItems
    .filter(({ product }) => !!product && typeof product === 'object')
    .map(({ product }) => product.id)

  const newData = rechargeSubscriptionInfo.filter(({ productId, baseProductId }) => (
    cartItemProductIds.includes(productId) || cartItemProductIds.includes(baseProductId)
  ))

  if (rechargeSubscriptionInfo.length === newData.length) {
    return
  }

  if (!newData.length) {
    await storage.del(RECHARGE_MIRROR_KEY)
    return
  }

  await storage.set(RECHARGE_MIRROR_KEY, newData)
}
