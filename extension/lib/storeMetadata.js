const { RECHARGE_MIRROR_KEY } = require('../constants')
const EMPTY_VAVLUE = 'empty_value'

module.exports = async (context, input) => {
  if (!input.products) {
    return {}
  }

  const storedMirrorCart = await getMirrorCart(context)

  const newRechargeCart = input.products
    .filter(({metadata, productId}) => metadata && productId)
    .map(({productId, quantity, metadata}) => {
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
    await setMirrorCart(context, newRechargeCart)
    return {}
  }

  const overlappingMirrorProducts = newRechargeCart
    .filter(({ productId: newProductId }) => (
      storedMirrorCart.some(({ productId }) => newProductId === productId)
    ))
  const overlappingMirrorProductIds = overlappingMirrorProducts.map(({ productId }) => productId)
  const mergedMirrorCart = [
    ...storedMirrorCart.filter(({ productId }) => !overlappingMirrorProductIds.includes(productId)),
    ...newRechargeCart.filter(({ productId }) => !overlappingMirrorProductIds.includes(productId))
  ]
  const mergedOverlappingMirrorProducts = mergeMirrorProducts(overlappingMirrorProducts, storedMirrorCart)
  mergedMirrorCart.push(...mergedOverlappingMirrorProducts)

  await setMirrorCart(context, mergedMirrorCart)
  return {}
}

const getMirrorCart = async (context) => {
  try {
    const rechargeMirrorCart = await context.storage.device.get(RECHARGE_MIRROR_KEY) || []
    return rechargeMirrorCart
  } catch (error) {
    context.log({ errorMessage: error.message }, 'could not get recharge mirrored cart data from device storage')
    return []
  }
}

const setMirrorCart = async (context, rechargeMirrorCart) => {
  try {
    await context.storage.device.set(RECHARGE_MIRROR_KEY, rechargeMirrorCart)
  } catch (error) {
    context.log.error({ errorMessage: error.message }, 'could not set recharge subscription data from device storage')
  }
}

/**
 * Merge overlapping products
 * @param {Object[]} newOverlappingProducts Overlapping products from new lines
 * @param {Object[]} storedMirrorCart products from storage
 * @return {{Object[]}}
 */
const mergeMirrorProducts = (newOverlappingProducts, storedMirrorCart) => (
  newOverlappingProducts
    .map(({
      productId: newProductId,
      baseProductId,
      selections: newSelections
    }) => {
      const { selections: storedSelections } = storedMirrorCart.find(({ productId }) => (
        productId === newProductId
      ))
      const overlappingSelection = newSelections
        .filter(({ frequencyValue: newFrequencyValue = EMPTY_VAVLUE }) => (
          storedSelections.some(({ frequencyValue = EMPTY_VAVLUE }) => newFrequencyValue === frequencyValue))
        )
      const overlappingFrequencies = overlappingSelection
        .map(({ frequencyValue = EMPTY_VAVLUE }) => frequencyValue)
      const mergedSelections = [
        ...newSelections.filter(({ frequencyValue = EMPTY_VAVLUE }) => !overlappingFrequencies.includes(frequencyValue)),
        ...storedSelections.filter(({ frequencyValue = EMPTY_VAVLUE }) => !overlappingFrequencies.includes(frequencyValue))
      ]
      const mergedOverlappingSelections = overlappingSelection
        .map((selection) => {
          const {
            frequencyValue: newFrequencyValue = EMPTY_VAVLUE,
            quantity: newQuantity,
            subscriptionInfo: newSubscriptionInfo
          } = selection
          const { quantity: storedQuantity } = storedSelections
            .find(({ frequencyValue = EMPTY_VAVLUE }) => frequencyValue === newFrequencyValue)
          const mergedSelection = {
            ...selection,
            quantity: newQuantity + storedQuantity
          }
          if (newSubscriptionInfo) {
            mergedSelection.subscriptionInfo = {
              ...newSubscriptionInfo,
              quantity: newQuantity + storedQuantity
            }
          }
          return mergedSelection
        })
      mergedSelections.push(...mergedOverlappingSelections)
      return {
        productId: newProductId,
        baseProductId,
        selections: mergedSelections
      }
    })
)
