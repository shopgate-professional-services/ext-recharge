const crypto = require('crypto')
const RechargeApi = require('../utilities/ReChargeApi')
const { RECHARGE_WEBHOOK_MAP } = require('../constants')
// const TTL = 24 * 60 * 60 * 1000 // 24 hours // ToDo
const TTL = 60 * 1000 // 1 Minute for debugging
const WEBHOOK_TOPIC = 'charge/paid'

module.exports = async (context) => {
  // check config to ensure all required data is available throw error if not
  checkForConfigError(context)
  const { meta: { appId } } = context
  const shopNumber = getShopNumber(appId)
  const existingWebhook = await context.storage.extension.map.getItem(RECHARGE_WEBHOOK_MAP, shopNumber)

  if (!existingWebhook) {
    await createWebhook(shopNumber, context)

    return
  }

  if (!shouldCheckWebook(existingWebhook)) {
    return
  }

  const webhookGood = await webhookExists(existingWebhook, shopNumber, context)

  // If webhook is still good update the stored timestamp
  if (webhookGood) {
    await context.storage.extension.map.setItem(
      RECHARGE_WEBHOOK_MAP, appId, { ...existingWebhook, timestamp: Date.now() }
    )

    return
  }

  await createWebhook(shopNumber, context)
}

/**
 * Get shop number for appId
 * @param {string} appId appId like shop_123456
 * @return {string}
 */
const getShopNumber = (appId) => (
  appId.split('_')[1]
)

const checkForConfigError = (context) => {
  const {
    webhookHandlerUrl,
    webhookHandlerToken,
    webhookHandlerSalt
  } = context.config

  if (!(webhookHandlerUrl && webhookHandlerToken && webhookHandlerSalt)) {
    throw new Error('Misconfiguration for Recharge Webhook creation')
  }
}

/**
 * Call Recharge api to create webhook, and store it in extension storage by app id
 * @param {string} shopNumber Shop number
 * @param {Object} context Step context object
 * @return {Promise<void>}
 */
const createWebhook = async (shopNumber, context) => {
  const api = new RechargeApi(context)

  const { webhook } = await api.createWebhook(
    generateWebhookAddress(shopNumber, context),
    WEBHOOK_TOPIC
  ) || {}

  if (!webhook) {
    throw new Error(`Recharge webhook was not created`)
  }

  await context.storage.extension.map.setItem(
    RECHARGE_WEBHOOK_MAP, shopNumber, { ...webhook, timestamp: Date.now() }
  )
}

/**
 * Generate address webhook should call when triggered
 * @param {string} shopNumber Shop number
 * @param {Object} context Step context object
 * @return {string}
 */
const generateWebhookAddress = (shopNumber, context) => {
  const {
    webhookHandlerUrl,
    webhookHandlerToken,
    webhookHandlerSalt
  } = context.config
  const query = [
    { key: 'apiKey', value: webhookHandlerToken },
    { key: 'shop_number', value: shopNumber },
    { key: 'auth_hash', value: generateAuthenticationHash(shopNumber, webhookHandlerSalt) }
  ].reduce((accum, { key, value }, index) => {
    const demarcation = index > 0 ? '&' : '?'
    return `${accum}${demarcation}${key}=${encodeURIComponent(value)}`
  }, '')

  return `${webhookHandlerUrl}${query}`
}

/**
 * Generate a authentication hash with salt
 * @param {string} shopNumber Shop number
 * @param {string} salt
 * @return {string}
 */
const generateAuthenticationHash = (shopNumber, salt) => {
  const hash = crypto.createHmac('sha1', salt)
  hash.update(shopNumber)

  return hash.digest('hex')
}

/**
 * Check timestamp of stored webhook to determine if it is NOT timed out
 * @param {Object} storedWebhook Webhook as stored in Extension store
 * @return {boolean}
 */
const shouldCheckWebook = (storedWebhook) => {
  const { timestamp = 0 } = storedWebhook || {}

  return timestamp + TTL < Date.now()
}

/**
 * Call Recharge api to ensure webhook is still exists and has the same topic and the correct address
 * @param {Object} existingWebhook Webhook as stored in Extension store
 * @param {string} shopNumber Shop number
 * @param context
 * @return {Promise<boolean>}
 */
const webhookExists = async (existingWebhook, shopNumber, context) => {
  const { id, topic: existingTopic } = existingWebhook
  // get webhook address according to current configuration
  const webhookAddress = generateWebhookAddress(shopNumber, context)
  const api = new RechargeApi(context)
  try {
    const { webhook } = await api.getWebhookById(id)

    return webhook && webhook.topic === existingTopic && webhook.address === webhookAddress
  } catch (err) {
    // return false if error is 404 not found
    if (err.message.includes('404')) {
      return false
    }

    throw err
  }
}
