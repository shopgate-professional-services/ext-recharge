const { RECHARGE_MIRROR_KEY } = require('../constants')
const mergeMirrorCarts = require('../helpers/mergeMirrorCarts')
const isLoggedIn = require('../helpers/isLoggedIn')

module.exports = async (context, input) => {
  if (!input.products) {
    return {}
  }
  const storage = isLoggedIn(context) ? context.storage.user : context.storage.device
  const storedMirrorCart = await getMirrorCart(storage, context.log)

  const newRechargeCart = input.products
    .filter(({ metadata, productId }) => metadata && productId)
    .map(({ productId, quantity, metadata }) => {
      const { shopifyVariantId, baseProductId, rechargeInfo } = metadata
      const mirrorProduct = { productId, baseProductId }
      const selection = { shopifyVariantId, quantity }

      if (rechargeInfo) {
        selection.frequencyValue = rechargeInfo.frequencyValue
        selection.subscriptionInfo = {
          ...rechargeInfo.subscriptionInfo,
          quantity
        }
      }

      mirrorProduct.selections = [selection]

      return mirrorProduct
    })

  // if there is no stored mirror cart there is no reason to merge
  if (!storedMirrorCart.length) {
    await setMirrorCart(storage, context.log, newRechargeCart)
    return {}
  }
  const mergedMirrorCart = mergeMirrorCarts(newRechargeCart, storedMirrorCart)

  await setMirrorCart(storage, context.log, mergedMirrorCart)
  return {}
}

/**
 * Get the mirror cart from storage
 * @param {Object} storage Context device or user storage
 * @param {Object} log Context log
 * @return {Promise<Array>}
 */
const getMirrorCart = async (storage, log) => {
  try {
    const rechargeMirrorCart = await storage.get(RECHARGE_MIRROR_KEY) || []
    return rechargeMirrorCart
  } catch (error) {
    log.error({ errorMessage: error.message }, 'could not get recharge mirrored cart data from device storage')
    return []
  }
}

/**
 * Get the mirror cart from storage
 * @param {Object} storage Context device or user storage
 * @param {Object} log Context log
 * @param {Object[]} rechargeMirrorCart Mirror cart to be saved into storage
 */
const setMirrorCart = async (storage, log, rechargeMirrorCart) => {
  try {
    await storage.set(RECHARGE_MIRROR_KEY, rechargeMirrorCart)
  } catch (error) {
    log.error({ errorMessage: error.message }, 'could not set recharge subscription data from device storage')
  }
}
