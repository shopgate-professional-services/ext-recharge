class ReChargeApi {
  /**
   * ReChargeApi Constructor
   * @param {PipelineContext} context Context object.
   */
  constructor (context) {
    this.baseUrl = context.config.baseUrl
    this.request = context.tracedRequest('ShopgateProjectReChargeAPI')
    this.logger = context.log
    this.token = context.config.apiToken
    this.storage = context.storage
  }

  /**
   * Sanitizes params for use in logging
   * @param {*} params Params to be logged
   * @return {*|{}}
   */
  sanitizeForLogging (params) {
    let sanitizedForLoggingBody = params
    if (typeof params === 'object') {
      sanitizedForLoggingBody = { ...params }
      for (let key in sanitizedForLoggingBody) {
        if (typeof sanitizedForLoggingBody[key] === 'string') {
          sanitizedForLoggingBody[key] = sanitizedForLoggingBody[key].slice(0, 60)
        }
        if (typeof sanitizedForLoggingBody[key] === 'object') {
          sanitizedForLoggingBody[key] = this.sanitizeForLogging(sanitizedForLoggingBody[key])
        }
      }
    }

    return sanitizedForLoggingBody
  }

  /**
   * Prevent authentication tokens from being logged
   * @param params
   * @return {object}
   */
  obfuscateSensitiveParamData (params) {
    if (!(params &&
      typeof params === 'object' &&
      params.headers &&
      typeof params.headers === 'object')) {

      return params
    }

    return {
      ...params,
      headers: {
        ['X-Recharge-Access-Token']: 'XXXXXXXXXXXXXXXX'
      }
    }
  }

  /**
   * Evaluate response code for error
   * @param {number} code Response code
   * @return {boolean}
   */
  isErroredCode (code) {
    if (code < 200) {
      return true
    }

    if (code >= 300) {
      return true
    }

    return false
  }

  /**
   * Make API call
   * @param {string} path Path to api enpoint
   * @param {string} method Request method
   * @param {[Object]} body Optional request body
   * @param {[Object]} qs Optional query string object
   * @return {Promise<any>}
   */
  async call ({ path, method, body, qs }) {
    return new Promise((resolve, reject) => {
      const params = {
        url: `${this.baseUrl}/${path}`,
        method,
        json: true,
        timeout: 5000,
        headers: {
          'X-Recharge-Access-Token': this.token
        }
      }
      if (body) {
        params.body = body
      }
      if (qs) {
        params.qs = qs
      }
      this.logger.debug(this.sanitizeForLogging(params), 'Calling RechargeAPI')
      this.request(params, (err, res = {}, body) => {
        if (err) {
          this.logger.error({
            body,
            httpCode: res.statusCode,
            requestParams: params ? JSON.stringify(this.obfuscateSensitiveParamData(params)) : 'no request params'
          }, 'ReCharge request error')
          return reject(err)
        }

        this.logger.debug(this.sanitizeForLogging(body), 'Received response from ReChargeAPI')

        if (this.isErroredCode(res.statusCode)) {
          this.logger.error({
            body,
            httpCode: res.statusCode,
            requestParams: params ? JSON.stringify(this.obfuscateSensitiveParamData(params)) : 'no request params'
          }, 'ReCharge request error')
          return reject(new Error(`Received error code from the API: ${res.statusCode}`))
        }

        return resolve(body)
      })
    })
  }

  /**
   * Get product subscription data from ReCharge API
   * @param {Object[]} productIds
   * @return {Promise<any>}
   */
  async getProducts (productIds = []) {
    return this.call({
      path: 'products',
      method: 'GET',
      qs: {
        shopify_product_ids: productIds.join(',')
      }
    })
  }

  async createOrderToken (checkoutParams) {
    return this.call({
      path: 'checkouts',
      method: 'POST',
      body: {
        'checkout': {
          ...checkoutParams || {}
        }
      }
    })
  }

  /**
   * Get ReCharge user information
   * @param {string} id Shopify/Shopgate user id
   * @return {Promise<any>}
   */
  async getCustomerByShopifyUserId (id) {
    return this.call({
      path: 'customers',
      method: 'GET',
      qs: {
        shopify_customer_id: id
      }
    })
  }
}

module.exports = ReChargeApi
