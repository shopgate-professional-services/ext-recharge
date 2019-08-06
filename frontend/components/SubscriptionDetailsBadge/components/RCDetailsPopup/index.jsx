import React from 'react';
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
 * @return {JSX}
 */
const RCDetailsPopup = () => (
  <div className={styles.popUpWrapper}>
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

export default RCDetailsPopup;
