const EMPTY_VALUE = 'empty_value'

module.exports = (cartOne, cartTwo) => {
  // find the products common to both carts
  const overlappingMirrorProducts = cartOne
    .filter(({ productId: newProductId }) => (
      cartTwo.some(({ productId }) => newProductId === productId)
    ))

  // expose the ids of products common to both carts so they can be used to easily identify products unique to each cart
  const overlappingMirrorProductIds = overlappingMirrorProducts.map(({ productId }) => productId)
  // added unique products from each cart into the mergedMirrorCart array
  const mergedMirrorCart = [
    ...cartTwo.filter(({ productId }) => !overlappingMirrorProductIds.includes(productId)),
    ...cartOne.filter(({ productId }) => !overlappingMirrorProductIds.includes(productId))
  ]
  // get an array of merged products. OverlappingMirrorProducts are derived from cartOne so cart
  // two is sent with overlapping products.
  const mergedOverlappingMirrorProducts = mergeMirrorProducts(overlappingMirrorProducts, cartTwo)
  // add merged products (that were common to both carts) to the mergedMirrorCart
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
      // get the selections array from the same product in cartTwo and call it storedSelections
      const { selections: storedSelections = [] } = cartTwo.find(({ productId }) => (
        productId === newProductId
      ))
      // find the selections that are common to both the product from cart one and the same product in cart two
      // selections are distinguished by their frequencyValue however if the selection is for a
      // non-subscription version of the product it will not have a frequencyValue. In that case
      // EMPTY_VALUE is used in substitution.
      const overlappingSelection = newSelections
        .filter(({ frequencyValue: newFrequencyValue = EMPTY_VALUE }) => (
          storedSelections.some(({ frequencyValue = EMPTY_VALUE }) => newFrequencyValue === frequencyValue))
        )
      // FrequencyValues of selections common to both the product from cart one and cart two are exposed so it is easy
      // to determine unique selections. EMPTY_VALUE is used in substitution when there is no frequencyValue
      const overlappingFrequencies = overlappingSelection
        .map(({ frequencyValue = EMPTY_VALUE }) => frequencyValue)

      // Selections unique to the product from cart one and cart two are added to the mergedSelections array
      const mergedSelections = [
        ...newSelections.filter(({ frequencyValue = EMPTY_VALUE }) => !overlappingFrequencies.includes(frequencyValue)),
        ...storedSelections.filter(({ frequencyValue = EMPTY_VALUE }) => !overlappingFrequencies.includes(frequencyValue))
      ]
      // Selections common to both the product from cart one and cart two are merged by adding
      // the quantity from one to the other.
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
      // add the merged selections to the mergedSelections array
      mergedSelections.push(...mergedOverlappingSelections)

      // return a product object with the merged selections
      return {
        productId: newProductId,
        baseProductId,
        selections: mergedSelections
      }
    })
)
