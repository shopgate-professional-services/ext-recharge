const crypto = require('crypto')
const RechargeApi = require('../utilities/ReChargeApi')
const { RECHARGE_WEBHOOK_MAP } = require('../constants')
const TTL = 86400000 // 24 hours
const WEBHOOK_TOPIC = 'charge/paid'

module.exports = async (context) => {
  // check config to ensure all required data is available throw error if not
  checkForConfigError(context)
  const { meta: { appId } } = context
  const existingWebhook = await context.storage.extension.map.getItem(RECHARGE_WEBHOOK_MAP, appId)

  if (!existingWebhook) {
    await createWebhook(appId, context)

    return
  }

  if (!shouldCheckWebook(existingWebhook)) {
    return
  }

  const webhookGood = await webhookExists(existingWebhook, appId, context)

  // If webhook is still good update the stored timestamp
  if (webhookGood) {
    await context.storage.extension.map.setItem(
      RECHARGE_WEBHOOK_MAP, appId, { ...existingWebhook, timestamp: Date.now() }
    )

    return
  }

  await createWebhook(appId, context)
}

const checkForConfigError = (context) => {
  const {
    webhookHandlerUrl,
    webhookHandlerRef,
    webhookHandlerToken,
    webhookHandlerSalt,
  } = context.config

  if (!(webhookHandlerUrl && webhookHandlerRef && webhookHandlerToken && webhookHandlerSalt)) {
    throw new Error('Misconfiguration for Recharge Webhook creation')
  }
}

/**
 * Call Recharge api to create webhook, and store it in extension storage by app id
 * @param {string} appId App id like shop_31840
 * @param {Object} context Step context object
 * @return {Promise<void>}
 */
const createWebhook = async (appId, context) => {
  const api = new RechargeApi(context)

  const { webhook } = await api.createWebhook(
    generateWebhookAddress(appId, context),
    WEBHOOK_TOPIC
  ) || {}

  if (!webhook) {
    throw new Error(`Recharge webhook was not created`)
  }

  await context.storage.extension.map.setItem(
    RECHARGE_WEBHOOK_MAP, appId, { ...webhook, timestamp: Date.now() }
  )
}

/**
 * Generate address webhook should call when triggered
 * @param {string} appId App id like shop_31840
 * @param {Object} context Step context object
 * @return {string}
 */
const generateWebhookAddress = (appId, context) => {
  const {
    webhookHandlerUrl,
    webhookHandlerRef,
    webhookHandlerToken,
    webhookHandlerSalt,
    webhookNodeEnv = 'production'
  } = context.config
  const variables = [
    { key: 'shop-number', value: appId },
    { key: 'auth-hash', value: generateAuthenticationHash(appId, webhookHandlerSalt) },
    { key: 'node-env', value: webhookNodeEnv }
  ].map(({ key, value }) => (`&variables[${key}]=${value}`))

  return `${webhookHandlerUrl}?ref=${webhookHandlerRef}&token=${webhookHandlerToken}${variables}`
}

/**
 * Generate a authentication hash with salt
 * @param {string} shopNumber Shop number like shop_31840
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
 * @param {string} appId App id like shop_31840
 * @param context
 * @return {Promise<boolean>}
 */
const webhookExists = async (existingWebhook, appId, context) => {
  const { id, topic: existingTopic } = existingWebhook
  // get webhook address according to current configuration
  const webhookAddress = generateWebhookAddress(appId, context)
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
