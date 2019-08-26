import { css } from 'glamor';

const rechargeGray = '#474747';
const linkColor = '#4DD6B7';

const popUpWrapper = css({
  position: 'absolute',
  width: 300,
  marginTop: 6,
  padding: 0,
  color: '#FFF',
  zIndex: 4,
  backgroundColor: rechargeGray,
  '&::before': {
    display: 'block',
    content: '""',
    width: 1,
    border: '10px solid transparent',
    position: 'absolute',
    top: -20,
    left: 0,
    borderBottomColor: rechargeGray,
  },
}).toString();

const popUpTitle = css({
  fontWeight: 800,
  marginBottom: 20,
}).toString();

const popUpContent = css({
  padding: 20,
}).toString();

const popUpContentLink = css({
  color: linkColor,
}).toString();

const popUpFooter = css({
  padding: 0,
  marginBottom: 25,
  textAlign: 'right',
  height: 28,
  display: 'flex',
}).toString();

const popUpFooterLink = css({
  display: 'flex',
  justifyContent: 'flex-end',
}).toString();

const popUpFooterImage = css({
  height: 28,
  width: 153,
  backgroundColor: 'transparent !important',
}).toString();

export default {
  popUpWrapper,
  popUpTitle,
  popUpContent,
  popUpContentLink,
  popUpFooter,
  popUpFooterLink,
  popUpFooterImage,
};

