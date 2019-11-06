const ReChargeApi = require('../utilities/ReChargeApi')
const ConnectRedisClient = require('@shopgate/connect-redis-client')
const _ = require('underscore')

let redisClient
/*
* Returns the cached data for a key
* @param {string} cacheKey
* @param {Object} context
* @return {Promise<any>}
*/
function getCacheEntry (cacheKey, context) {
  return new Promise((resolve) => {
    let ignoreTimeout = false

    // skip this cache if the read takes too long
    setTimeout(() => {
      if (ignoreTimeout) {
        return
      }

      context.log.info({
        cacheKey
      }, 'recharge redis cache get took too long.')

      resolve(null)
    }, 100)

    redisClient.get(cacheKey)
      .then((result) => {
        ignoreTimeout = true
        resolve(result)
      })
      .catch((e) => {
        ignoreTimeout = true
        context.log.error({
          redisError: e,
          cacheKey
        }, 'recharge redis cache get error')

        resolve(null)
      })
  })
}

module.exports = async (context, input) => {
  const { productIds = [] } = input || {}

  if (!productIds.length) {
    return { products: [] }
  }

  const { redisClientShopNumber, redisClientSecret } = context.config || {}

  if (!redisClient) {
    redisClient = new ConnectRedisClient('@shopgate-project/recharge', redisClientShopNumber, redisClientSecret)
  }

  // Create cache key with product_id used to fetch from Recharge API
  const buildCacheKey = id => `recharge.subscriptionProducts.${id}`

  const cachedOutput = []

  // check which data we already have in cache
  const uncachedIds = await Promise.all(productIds.map(async (id) => {
    const cachedData = JSON.parse(await getCacheEntry(buildCacheKey(id), context))

    if (!cachedData) {
      return id
    }

    if (_.isEmpty(cachedData)) {
      return null
    }

    cachedOutput.push(cachedData)
    return null
  }))

  const productIdsToFetch = uncachedIds.filter(id => id !== null)

  // If we got all product subscriptions from cache then return
  if (!productIdsToFetch.length) {
    return {
      products: cachedOutput
    }
  }

  // Fetch products from API
  const api = new ReChargeApi(context)
  const { products = [] } = await api.getProducts(productIdsToFetch)

  // TTL in seconds
  const TTL = context.config.rechargeSubscriptionTTLBackend / 1000

  // If no subscription info then save empty object for id
  if (!products.length) {
    productIdsToFetch.forEach(async (id) => {
      const cacheKey = buildCacheKey(id)
      try {
        // shopify_product_id is used to keep an id for subscription product in redux
        await redisClient.set(cacheKey, JSON.stringify({}), TTL)
      } catch (e) {
        context.log.error({
          redisError: e,
          cacheKey
        }, 'recharge redis cache set error')
      }
    })
  }

  // put response and missing product from response into cache
  products.forEach(async (product) => {
    const { product_id: id } = product || {}
    const cacheKey = buildCacheKey(id)
    try {
      await redisClient.set(cacheKey, JSON.stringify(product), TTL)
    } catch (e) {
      context.log.error({
        redisError: e,
        cacheKey
      }, 'recharge redis cache set error')
    }
  })

  return { products }
}
