# Shopgate Connect - ReCharge

This extension integrates a Shopgate app with the [Recharge](https://apps.shopify.com/subscription-payments). When a product is available for a subscription, the user will follow a normal checkout process to checkout subscription and non-subscription products.


## Setup

- Login to your shopify backend and navigate to admin/apps/shopify-recurring-payments/settings/checkout 
- Copy the code from styles.css and add it to "CSS editor"
- Copy the code from thank_you.html and add it to "Additional & scripts and trackers"
- navigate to admin/apps/shopify-recurring-payments/settings/customer portal
- copy the code from customer_portal.html into Customize styles > Storefront header HTML/CSS/JS
- Navigate to a customer account in Shopify store front and click *manage subscriptions* and check if URL partial deviates from default configuration below

## Configuration
It is necessary to configure the Recarge api base URL and configure your shop's recharge api token or tokens. Defining more than one api token increases the number of calls per minute allowed to the Recharge api.
You can also configure the recharge details button text, recharge details button icon src, recharge details pop up title, recharge details pop up text, recharge details pop up learn more link text, recharge details pop up learn more link href, recharge details pop up footer image, and recharge currency.

**baseUrl**
```json
{
  "baseUrl": "https://api.rechargeapps.com"
}
```
**apiTokens**
```json
{
  "apiTokens": ["123456abcdef"]
}
```
**webhookApiToken**
```json
{
  "webhookApiToken": "123456abcdef"
}
```
Use one of the apiTokens above, but don't change, to prevent duplicate webhooks. 

**shopifySubscriptionPath**
```json
{
  "shopifySubscriptionPath": "tools/recurring/customers"
}
```
Please check **Setup** section to verify URL path.

**cacheTimeCustomer**
```json
{
  "cacheTimeCustomer": 1800000
}
 ```
Cache time (ms) for ReCharge customer data. Default is 30m.

**Recharge details configurations**
```json
 {
   "rechargeDetailsButtonText": "Subscription details",
   "rechargeDetailsButtonIconSrc": "https://rechargestatic-bootstrapheroes.netdna-ssl.com/static/images/widget/rc_widget__icon__black@2x.png",
   "rechargeDetailsPopUpText": "Products are automatically delivered on your schedule. No obligation, modify or cancel your subscription anytime.",
   "rechargeDetailsPopUpTitle": "How subscriptions work",
   "rechargeDetailsPopUpLearnMoreLinkText": "Learn more...",
   "rechargeDetailsPopUpLearnMoreLinkHref": "http://rechargepayments.com/subscribe-with-recharge",
   "rechargeDetailsPopUpFooterImageSrc": "https://rechargestatic-bootstrapheroes.netdna-ssl.com/static/images/widget/rc_widget__banner@2x.png",
}
```

**rechargeSubscriptionTTLBackend**
```json
{
  "rechargeSubscriptionTTLBackend": 1200000
}
 ```

### Additional Guru configuration
In guru you must add the redis secret token to the config `Shopgate Connect Extension Settings.` The token must be entered in JSON format as follows:
```json
{
  "@shopgate-project/recharge": {
    "redisSecret": "",
    "webhookHandlerUrl": "",
    "webhookHandlerToken": "",
    "webhookHandlerSalt": ""
  }
}
```

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.
