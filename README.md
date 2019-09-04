# Shopgate Connect - ReCharge

This extension integrates a Shopgate app with the [Recharge](https://apps.shopify.com/subscription-payments). When a product is available for a subscription, the user will follow a normal checkout process to checkout subscription and non-subscription products.


## Setup

- Login to your shopify backend and navigate to admin/apps/shopify-recurring-payments/settings/checkout 
- Copy the code from styles.css and add it to "CSS editor"
- Copy the code from thank_you.html and add it to "Additional & scripts and trackers"

## Configuration
It is necessary to configure the Recarge api base URL and configure your shop's recharge app token
You can also configure the recharge details button text, recharge details button icon src, recharge details pop up title, recharge details pop up text, recharge details pop up learn more link text, recharge details pop up learn more link href, recharge details pop up footer image, and recharge currency.
```json
{
  "baseUrl": "https://api.rechargeapps.com"
}
```
apiToken
```json
{
  "apiToken": "123456abcdef"
}
```

Recharge details configurations.
```json
 {
   "rechargeDetailsButtonText": "Subscription details",
   "rechargeDetailsPopUpTitle": "How subscriptions work",
   "rechargeDetailsButtonIconSrc": "https://rechargestatic-bootstrapheroes.netdna-ssl.com/static/images/widget/rc_widget__icon__black@2x.png",
   "rechargeDetailsPopUpText": "Products are automatically delivered on your schedule. No obligation, modify or cancel your subscription anytime.",
   "rechargeDetailsPopUpTitle": "How subscriptions work",
   "rechargeDetailsPopUpLearnMoreLinkText": "Learn more...",
   "rechargeDetailsPopUpLearnMoreLinkHref": "http://rechargepayments.com/subscribe-with-recharge",
   "rechargeDetailsPopUpFooterImageSrc": "https://rechargestatic-bootstrapheroes.netdna-ssl.com/static/images/widget/rc_widget__banner@2x.png",
}
```

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.
