import { PRODUCT_LIFETIME } from '@shopgate/engage/product';

export default (requestedProductIds, recievedProducts) => {
  const returnedProductsObj = recievedProducts.reduce((collectedProducts, product) => ({
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
