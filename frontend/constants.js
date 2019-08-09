import getConfig from './helpers/getConfig';

const { shopifyAlias } = getConfig();
//
export const RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS = 'RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS';
export const REQUEST_RECHARGE_SUBSCRIPTION_ITEMS = 'REQUEST_RECHARGE_SUBSCRIPTION_ITEMS';
export const ERROR_RECHARGE_SUBSCRIPTION_ITEMS = 'ERROR_RECHARGE_SUBSCRIPTION_ITEMS';

export const RECEIVE_RECHARGE_CART_TOKEN = 'RECEIVE_RECHARGE_CART_TOKEN';
export const REQUEST_RECHARGE_CART_TOKEN = 'REQUEST_RECHARGE_CART_TOKEN';
export const ERROR_RECHARGE_CART_TOKEN = 'ERROR_RECHARGE_CART_TOKEN';

export const REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS = '@shopgate-project/recharge/rechargeSubscriptionItems';
export const REDUX_NAMESPACE_RECHARGE_CART_TOKEN = '@shopgate-project/recharge/rechargeCartToken';

export const REQUIRED_SUBSCRIPTION_TEXT = 'subscription_only';

export const REQUIRED_SUBSCRIPTION_LABEL = 'Recharge Subscription';

export const OPTIONAL_SUBSCRIPTION_LABEL = 'Recharge Subscription(optional)';

export const GET_SUBSCRIPTION_PRODUCT = 'shopgate-project.recharge.getSubscriptionProduct';
export const CREATE_CHECKOUT_TOKEN = 'shopgate-project.recharge.createCheckoutToken';

export const RECHARGE_CHECKOUT_PATH = 'https://checkout.rechargeapps.com/r/checkout/';

export const APPENDED_SHOPIFY_DOMAIN_INFO = `${shopifyAlias}=.myshopify.com`;
