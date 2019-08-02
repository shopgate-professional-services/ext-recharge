module.exports = async (context, input) => {

  context.config.apiToken = '3f72a73035a93fc7d80e7e8d17d9f734bfd52901b6cad5d9b6eb88af';

  const {apiToken} = context.config;

  // TODO: check if input.productIds is !empty

  const request = context.tracedRequest('ShopgateProjectReChargeProducts');

  // TODO: refactor to general API client later

  const params = {
    uri: 'https://api.rechargeapps.com/products',
    qs: {
      shopify_product_ids: input.productIds,
    },
    method: 'GET',
    headers: {
      'X-Recharge-Access-Token': apiToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return {
    'products': [
      {
        'collection_id': 381,
        'created_at': '2018-04-09T13:31:20',
        'discount_amount': 0,
        'discount_type': 'percentage',
        'id': 711670,
        'images': {
          'large': 'https://cdn.shopify.com/s/files/1/0175/0695/9460/products/Sumatra_Coffee_large.png',
          'medium': 'https://cdn.shopify.com/s/files/1/0175/0695/9460/products/Sumatra_Coffee__medium.png',
          'original': 'https://cdn.shopify.com/s/files/1/0175/0695/9460/products/Sumatra_Coffee_.png',
          'small': 'https://cdn.shopify.com/s/files/1/0175/0695/9460/products/Sumatra_Coffee__small.png'
        },
        'product_id': 2225386691,
        'shopify_product_id': 2225386691,
        'subscription_defaults': {
          'charge_interval_frequency': 1,
          'cutoff_day_of_month': null,
          'cutoff_day_of_week': null,
          'expire_after_specific_number_of_charges': 3,
          'handle': 'sumatra-coffee',
          'number_charges_until_expiration': 1,
          'order_day_of_month': '10',
          'order_day_of_week': null,
          'order_interval_frequency': 1,
          'order_interval_frequency_options': [
            '1'
          ],
          'order_interval_unit': 'Months',
          'storefront_purchase_options': 'subscription_only'
        },
        'title': 'Sumatra Coffee',
        'updated_at': '2018-12-04T12:10:30'
      },
      {
        'collection_id': 3815646,
        'created_at': '2018-04-09T13:31:20',
        'discount_amount': 0,
        'discount_type': 'percentage',
        'id': 711671,
        'images': {
          'large': 'https://cdn.shopify.com/s/files/1/0175/0695/9460/products/Sumatra_Coffee_large.png',
          'medium': 'https://cdn.shopify.com/s/files/1/0175/0695/9460/products/Sumatra_Coffee__medium.png',
          'original': 'https://cdn.shopify.com/s/files/1/0175/0695/9460/products/Sumatra_Coffee_.png',
          'small': 'https://cdn.shopify.com/s/files/1/0175/0695/9460/products/Sumatra_Coffee__small.png'
        },
        'product_id': 2225386691,
        'shopify_product_id': 2225386691,
        'subscription_defaults': {
          'charge_interval_frequency': 1,
          'cutoff_day_of_month': null,
          'cutoff_day_of_week': null,
          'expire_after_specific_number_of_charges': 3,
          'handle': 'sumatra-coffee',
          'number_charges_until_expiration': 3,
          'order_day_of_month': '10',
          'order_day_of_week': null,
          'order_interval_frequency': 1,
          'order_interval_frequency_options': [
            '1'
          ],
          'order_interval_unit': 'Months',
          'storefront_purchase_options': 'subscription_and_onetime'
        },
        'title': 'Sumatra Coffee',
        'updated_at': '2018-12-04T12:10:30'
      }
    ]
  }

  // TODO: error handling
  const response = await request(params);
  console.warn(response);
  return {products: response.products};
}
