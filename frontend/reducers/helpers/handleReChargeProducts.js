import { PRODUCT_LIFETIME } from '@shopgate/engage/product';

/**
 *
 * @param {string[]} requestedProductIds Product ids originally requested from ReCharge api
 * @param {Object[]} receivedProducts ReCharge Product objects
 * @return {Object}
 */
export default (requestedProductIds, receivedProducts) => {
  const returnedProductsObj = receivedProducts.reduce((collectedProducts, product) => ({
    ...collectedProducts,
    [product.shopify_product_id]: {
      subscriptionInfo: product,
      isFetching: false,
      expires: Date.now() + PRODUCT_LIFETIME,
    },
  }), {});
  const noSubscriptionProducts = requestedProductIds
    .filter(productId => !returnedProductsObj.hasOwnProperty(productId))
    .reduce((collectedProducts, productId) => ({
      ...collectedProducts,
      [productId]: {
        isFetching: false,
        expires: Date.now() + PRODUCT_LIFETIME,
      },
    }), {});

  return {
    ...returnedProductsObj,
    ...noSubscriptionProducts,
  };
};
