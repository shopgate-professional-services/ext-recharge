import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Link';
import Image from '@shopgate/pwa-common/components/Image';
import styles from './style';
import getConfig from '../../../../helpers/getConfig';

const {
  rechargeDetailsPopUpTitle,
  rechargeDetailsPopUpText,
  rechargeDetailsPopUpLearnMoreLinkText,
  rechargeDetailsPopUpLearnMoreLinkHref,
  rechargeDetailsPopUpFooterImageSrc,
} = getConfig();

/**
 * RCDetailsPopUp
 * @param {Function} closePopUp Function to close popup
 * @return {JSX}
 */
const RCDetailsPopup = ({ closePopUp }) => (
  <div
    tabIndex="0"
    role="link"
    onKeyDown={closePopUp}
    className={styles.popUpWrapper}
    onClick={closePopUp}
  >
    <div className={styles.popUpContent}>
      <div className={styles.popUpTitle}>{rechargeDetailsPopUpTitle}</div>
      {rechargeDetailsPopUpText}
      <Link
        className={styles.popUpContentLink}
        href={rechargeDetailsPopUpLearnMoreLinkHref}
      >
        {rechargeDetailsPopUpLearnMoreLinkText}
      </Link>
    </div>
    <div className={styles.popUpFooter}>
      <Link
        className={styles.popUpFooterLink}
        href={rechargeDetailsPopUpLearnMoreLinkHref}
      >
        <Image
          className={styles.popUpFooterImage}
          src={rechargeDetailsPopUpFooterImageSrc}
          alt="Learn more about subscriptions"
        />
      </Link>
    </div>
  </div>
);

RCDetailsPopup.propTypes = {
  closePopUp: PropTypes.func,
};

RCDetailsPopup.defaultProps = {
  closePopUp: () => {},
};

export default RCDetailsPopup;
