import getConfig from './helpers/getConfig';

const { shopifyAlias } = getConfig();
// Actions
export const RECEIVE_RECHARGE_SUBSCRIPTION_PRODUCTS = 'RECEIVE_RECHARGE_SUBSCRIPTION_PRODUCTS';
export const REQUEST_RECHARGE_SUBSCRIPTION_PRODUCTS = 'REQUEST_RECHARGE_SUBSCRIPTION_PRODUCTS';
export const ERROR_RECHARGE_SUBSCRIPTION_PRODUCTS = 'ERROR_RECHARGE_SUBSCRIPTION_PRODUCTS';

export const RECEIVE_RECHARGE_CUSTOMER_HASH = 'RECEIVE_RECHARGE_CUSTOMER_HASH';
export const REQUEST_RECHARGE_CUSTOMER_HASH = 'REQUEST_RECHARGE_CUSTOMER_HASH';
export const ERROR_RECHARGE_CUSTOMER_HASH = 'ERROR_RECHARGE_CUSTOMER_HASH';
export const REMOVE_RECHARGE_CUSTOMER_HASH = 'REMOVE_RECHARGE_CUSTOMER_HASH';

export const RECEIVE_RECHARGE_CART = 'RECEIVE_RECHARGE_CART';
export const REQUEST_RECHARGE_CART = 'REQUEST_RECHARGE_CART';
export const ERROR_RECHARGE_CART = 'ERROR_RECHARGE_CART';

export const UPDATE_RECHARGE_INFO = 'UPDATE_RECHARGE_INFO';
export const UPDATE_SHOPIFY_VARIANT_ID = 'UPDATE_SHOPIFY_VARIANT_ID';

export const SET_BLOCK_RECHARGE_CART = 'SET_BLOCK_RECHARGE_CART';

// Redux namespace
const EXTENSION_NAME = '@shopgate-project/recharge';
export const REDUX_NAMESPACE_RECHARGE_SUBSCRIPTION_ITEMS = `${EXTENSION_NAME}/rechargeSubscriptionItems`;
export const REDUX_NAMESPACE_RECHARGE_CART = `${EXTENSION_NAME}/rechargeCart`;
export const REDUX_NAMESPACE_RECHARGE_CUSTOMER_HASH = `${EXTENSION_NAME}/rechargeCustomerHash`;
export const REDUX_NAMESPACE_RECHARGE_INFO = `${EXTENSION_NAME}/rechargeInfo`;

export const REQUIRED_SUBSCRIPTION_TEXT = 'subscription_only';
export const DISCOUNT_TYPE_PERCENTAGE = 'percentage';
export const NO_SUBSCRIPTION_FREQUENCY_VALUE = 'No Subscription';

// Pipelines
export const GET_SUBSCRIPTION_PRODUCTS = 'shopgate-project.recharge.getSubscriptionProducts';
export const GET_CART = 'shopgate-project.recharge.getCart';
export const GET_CUSTOMER_HASH = 'shopgate-project.recharge.getCustomerHash';

export const RECHARGE_CHECKOUT_PATH = 'https://checkout.rechargeapps.com/r/checkout/';

export const APPENDED_SHOPIFY_DOMAIN_INFO = `${shopifyAlias}=.myshopify.com`;
