import getConfig from './helpers/getConfig';

const { shopifyAlias } = getConfig();
// Actions
export const RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS = 'RECEIVE_RECHARGE_SUBSCRIPTION_ITEMS';
export const REQUEST_RECHARGE_SUBSCRIPTION_ITEMS = 'REQUEST_RECHARGE_SUBSCRIPTION_ITEMS';
export const ERROR_RECHARGE_SUBSCRIPTION_ITEMS = 'ERROR_RECHARGE_SUBSCRIPTION_ITEMS';

export const RECEIVE_RECHARGE_CART_TOKEN = 'RECEIVE_RECHARGE_CART_TOKEN';
export const REQUEST_RECHARGE_CART_TOKEN = 'REQUEST_RECHARGE_CART_TOKEN';
export const ERROR_RECHARGE_CART_TOKEN = 'ERROR_RECHARGE_CART_TOKEN';

export const RECEIVE_RECHARGE_CUSTOMER_HASH = 'RECEIVE_RECHARGE_CUSTOMER_HASH';
export const REQUEST_RECHARGE_CUSTOMER_HASH = 'REQUEST_RECHARGE_CUSTOMER_HASH';
export const ERROR_RECHARGE_CUSTOMER_HASH = 'ERROR_RECHARGE_CUSTOMER_HASH';
export const REMOVE_RECHARGE_CUSTOMER_HASH = 'REMOVE_RECHARGE_CUSTOMER_HASH';

export const RECEIVE_RECHARGE_CART = 'RECEIVE_RECHARGE_CART';
export const REQUEST_RECHARGE_CART = 'REQUEST_RECHARGE_CART';
export const ERROR_RECHARGE_CART = 'ERROR_RECHARGE_CART';

export const UPDATE_RECHARGE_INFO = 'UPDATE_RECHARGE_INFO';

export const RECHARGE_ERROR_ADD_PRODUCTS_TO_CART = 'RECHARGE_ERROR_ADD_PRODUCTS_TO_CART';

// Redux namespace
export const REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS = '@shopgate-project/recharge/rechargeSubscriptionItems';
export const REDUX_NAMESPACE_RECHARGE_CART = '@shopgate-project/recharge/rechargeCart';
export const REDUX_NAMESPACE_RECHARGE_CUSTOMER_HASH = '@shopgate-project/recharge/rechargeCustomerHash';
export const REDUX_NAMESPACE_RECHARGE_INFO = '@shopgate-project/recharge/rechargeInfo';

export const REQUIRED_SUBSCRIPTION_TEXT = 'subscription_only';
export const DISCOUNT_TYPE_PERCENTAGE = 'percentage';

// Pipelines
export const GET_SUBSCRIPTION_PRODUCTS = 'shopgate-project.recharge.getSubscriptionProducts';
export const CREATE_CHECKOUT = 'shopgate-project.recharge.createCheckout';
export const GET_CUSTOMER_HASH = 'shopgate-project.recharge.getCustomerHash';

export const RECHARGE_CHECKOUT_PATH = 'https://checkout.rechargeapps.com/r/checkout/';

export const APPENDED_SHOPIFY_DOMAIN_INFO = `${shopifyAlias}=.myshopify.com`;
