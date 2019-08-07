import React, { useState } from 'react';
import Image from '@shopgate/pwa-common/components/Image';
import Button from '@shopgate/pwa-common/components/Button';
import RCDetailsPopup from './components/RCDetailsPopup';
import styles from './style';

import getConfig from '../../helpers/getConfig';

const { rechargeDetailsButtonText, rechargeDetailsButtonIconSrc } = getConfig();
/**
 * Subscription Details Badge Component
 * @return {JSX}
 */
const SubscriptionDetailsBadge = () => {
  const [show, setShow] = useState(false);
  /**
   * toggle the subscription details pop up
   */
  const togglePopUp = () => {
    setShow(!show);
  };

  /**
   * close the subscription details pop up
   */
  const closePopUp = () => {
    setShow(false);
  };

  return (
    <div className={styles.wrapper}>
      <Button
        onClick={togglePopUp}
        className={styles.button}
      >
        <Image
          className={styles.image}
          src={rechargeDetailsButtonIconSrc}
          alt="subscription details"
        />
        {rechargeDetailsButtonText}
      </Button>
      {show &&
        <RCDetailsPopup closePopUp={closePopUp} />
      }
    </div>
  );
};

export default SubscriptionDetailsBadge;
