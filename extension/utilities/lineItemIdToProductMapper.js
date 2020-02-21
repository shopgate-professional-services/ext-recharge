const { RECHARGE_LINE_ITEM_ID_TO_PRODUCT_MAP } = require('../constants')

const saveLineIdToProductIdMap = async (context, cartLineItems) => {
  const mapping = cartLineItems
    .filter(item => item.product && typeof item.product === 'object')
    .map(item => ({ lineItemId: item.id, productId: item.product.id, name: item.product.name }))

  return context.storage.device.set(RECHARGE_LINE_ITEM_ID_TO_PRODUCT_MAP, mapping)
}

const getLineIdToProductIdMap = async (context) => {
  return context.storage.device.get(RECHARGE_LINE_ITEM_ID_TO_PRODUCT_MAP)
}

module.exports = { saveLineIdToProductIdMap, getLineIdToProductIdMap }
