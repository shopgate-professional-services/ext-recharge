const crypto = require('crypto')
const RechargeApi = require('../utilities/ReChargeApi')
const { RECHARGE_WEBHOOK_MAP } = require('../constants')
const TTL = 86400000
const WEBHOOK_TOPIC = 'charge/paid'

module.exports = async (context) => {
  const { meta: { appId } } = context
  const existingWebhook = await context.storage.extension.map.getItem(RECHARGE_WEBHOOK_MAP, appId)

  if (!existingWebhook) {
    await createWebhook(appId, context)

    return
  }

  if (!shouldCheckWebook(existingWebhook)) {
    return
  }

  const webhookGood = await webhookExists(existingWebhook, context)

  if (webhookGood) {
    await context.storage.extension.map.setItem(
      RECHARGE_WEBHOOK_MAP, appId, { ...existingWebhook, timestamp: Date.now() }
    )

    return
  }

  await createWebhook(appId, context)
}

const createWebhook = async (appId, context) => {
  const api = new RechargeApi(context)
  const {
    webHookHandlerUrl,
    webHookHandlerRef,
    webHookHandlerToken,
    webHookHandlerSalt
  } = context.config
  const addressVariables = [
    { shop_number: appId },
    { auth_hash: generateAuthenticationHash(appId, webHookHandlerSalt) }
  ]
  const { webhook } = await api.createWebhook(
    generateWebookAddress(webHookHandlerUrl, webHookHandlerToken, webHookHandlerRef, addressVariables),
    WEBHOOK_TOPIC
  ) || {}

  await context.storage.extension.map.setItem(
    RECHARGE_WEBHOOK_MAP, appId, { ...webhook, timestamp: Date.now() }
  )
}

const generateWebookAddress = (baseUrl, token, ref, variables = []) => (
  `${baseUrl}?ref=${ref}&token=${token}${variables.map(({ key, value }) => (`&variables[${key}]=${value}`))}`
)

const generateAuthenticationHash = (shopNumber, salt) => {
  const hash = crypto.createHash('sha1')
  hash.update(`${shopNumber}-${salt}`)

  return hash.digest('hex')
}

const shouldCheckWebook = (storedWebhook) => {
  const { timestamp = 0 } = storedWebhook || {}

  return timestamp + TTL > Date.now()
}

const webhookExists = (existingWebhook, context) => {
  const { id, topic: existingTopic } = existingWebhook
  const api = new RechargeApi(context)

  try {
    const { webhook } = api.getWebhookById(id)

    return webhook && webhook.topic === existingTopic
  } catch (err) {
    return false
  }
}
