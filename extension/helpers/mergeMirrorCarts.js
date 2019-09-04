const EMPTY_VALUE = 'empty_value'

module.exports = (cartOne, cartTwo) => {
  const overlappingMirrorProducts = cartOne
    .filter(({ productId: newProductId }) => (
      cartTwo.some(({ productId }) => newProductId === productId)
    ))

  const overlappingMirrorProductIds = overlappingMirrorProducts.map(({ productId }) => productId)
  const mergedMirrorCart = [
    ...cartTwo.filter(({ productId }) => !overlappingMirrorProductIds.includes(productId)),
    ...cartOne.filter(({ productId }) => !overlappingMirrorProductIds.includes(productId))
  ]
  const mergedOverlappingMirrorProducts = mergeMirrorProducts(overlappingMirrorProducts, cartTwo)
  mergedMirrorCart.push(...mergedOverlappingMirrorProducts)

  return mergedMirrorCart
}

/**
 * Merge overlapping products
 * @param {Object[]} newOverlappingProducts Overlapping products from new lines
 * @param {Object[]} cartTwo products from storage
 * @return {Object[]}
 */
const mergeMirrorProducts = (newOverlappingProducts, cartTwo) => (
  newOverlappingProducts
    .map(({
      productId: newProductId,
      baseProductId,
      selections: newSelections = []
    }) => {
      const { selections: storedSelections = [] } = cartTwo.find(({ productId }) => (
        productId === newProductId
      ))

      const overlappingSelection = newSelections
        .filter(({ frequencyValue: newFrequencyValue = EMPTY_VALUE }) => (
          storedSelections.some(({ frequencyValue = EMPTY_VALUE }) => newFrequencyValue === frequencyValue))
        )

      const overlappingFrequencies = overlappingSelection
        .map(({ frequencyValue = EMPTY_VALUE }) => frequencyValue)

      const mergedSelections = [
        ...newSelections.filter(({ frequencyValue = EMPTY_VALUE }) => !overlappingFrequencies.includes(frequencyValue)),
        ...storedSelections.filter(({ frequencyValue = EMPTY_VALUE }) => !overlappingFrequencies.includes(frequencyValue))
      ]

      const mergedOverlappingSelections = overlappingSelection
        .map((selection) => {
          const {
            frequencyValue: newFrequencyValue = EMPTY_VALUE,
            quantity: newQuantity,
            subscriptionInfo: newSubscriptionInfo
          } = selection
          const { quantity: storedQuantity } = storedSelections
            .find(({ frequencyValue = EMPTY_VALUE }) => frequencyValue === newFrequencyValue)
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
