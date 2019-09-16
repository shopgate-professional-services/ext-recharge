import getConfig from './getConfig';

const { shopifyAlias } = getConfig();

/**
 * Create url to recharge customer portal
 * @param {string} customerHash Customer hash
 * @return {string}
 */
export default customerHash => (
  `https://${shopifyAlias}.myshopify.com/tools/recurring/customers/${customerHash}/subscriptions`
);
