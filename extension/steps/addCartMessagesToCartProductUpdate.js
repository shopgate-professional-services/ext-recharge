const { RECHARGE_CART_MESSAGES } = require('../constants')
const isLoggedIn = require('../helpers/isLoggedIn')
const isArrayWithElements = require('../helpers/isArrayWithElements')

module.exports = async (context, { messages }) => {
  const storage = isLoggedIn(context) ? context.storage.user : context.storage.device
  const additionalMessages = await storage.get(RECHARGE_CART_MESSAGES)

  if (!isArrayWithElements(messages) && !isArrayWithElements(additionalMessages)) {
    return { messages }
  }

  await storage.del(RECHARGE_CART_MESSAGES)

  return { messages: [
    ...messages || [],
    ...additionalMessages || []
  ] }
}
