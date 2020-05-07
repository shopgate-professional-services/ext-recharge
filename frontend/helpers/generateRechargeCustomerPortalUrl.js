import getConfig from './getConfig';

const { shopifyAlias, shopifySubscriptionPath } = getConfig();

/**
 * Create url to recharge customer portal
 * @param {string} customerHash Customer hash
 * @return {string}
 */
export default (customerHash) => {
  console.warn('getUrl', customerHash);
  return `https://${shopifyAlias}.myshopify.com/${shopifySubscriptionPath}/${customerHash}/subscriptions`;
};
