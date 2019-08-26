import { css } from 'glamor';

const wrapper = css({
  padding: '13px 16px',
}).toString();

const image = css({
  height: 18,
  width: 15,
  display: 'inline-block',
  backgroundColor: 'transparent !important',
  marginRight: 3,
}).toString();

const button = css({
  display: 'flex',
  padding: 0,
  fontSize: '.8em',
  textDecoration: 'underline',
  lineHeight: '18px',
}).toString();

export default {
  wrapper,
  image,
  button,
};
