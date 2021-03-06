# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.5.0] - 2020-05-06
### Added
- Configuration for Shopify "Manage Subscription" URL partial

## [1.4.0] - 2020-04-23
### Added
- Creation of recharge charge/paid webhook to track recurring payments

## [1.3.0] - 2020-03-31
### Added
- support for more than one Recharge api token to spread api calls over all defined api tokens to increase the number of allowed calls per minute.

## [1.2.5] - 2020-03-30
### Added
- improved error logging for request to Recharge api
### Fixed
- cart checkout button portal now aware of recharge cart token fetching
- user checkout params not being sent to recharge checkout endpoints with line items

## [1.2.4] - 2020-03-03
### Changed
- Logic for charge interval frequency for pre-paid subscription items and added a singularize heler.

## [1.2.3] - 2020-02-21
### Changed
- Message passed in update cart product when editing subscription rather than throwing an error

## [1.2.2] - 2020-02-20
### Added
- support for recurring price

## [1.2.1] - 2020-01-28
### Added
- Portal around the text for Recharge AddToCartBar Component

## [1.2.0] - 2019-11-18
### Added
- Display of recharge cart prices from Recharge cart response.
### Fixed
- Quantity issue with optional subscription products when adding non subscription and subscription products.

## [1.1.0] - 2019-11-08
### Added
- Support for increasing quantity on non subscription products on the cart page
- Cache for subscription products
### Fixed
- Race condition for adding products on PDP

## [1.0.2] - 2019-10-24
### Added
- Cache for customer data

## [1.0.1] - 2019-10-17
### Added
- Renamed exposed custom data key to rechargeCustomData

## [1.0.0] - 2019-09-16
### Added
- Initial release of Recharge Integration

[Unreleased]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.5.0...HEAD
[1.5.0]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.2.5...v1.3.0
[1.2.5]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/shopgate-professional-services/ext-recharge/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/shopgate-professional-services/ext-recharge/releases/v1.0.0
