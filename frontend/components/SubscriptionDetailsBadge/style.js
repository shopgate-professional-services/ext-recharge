import { css } from 'glamor';

const image = css({
  height: 21,
  width: 18,
  display: 'inline-block',
  backgroundColor: 'transparent !important',
  marginRight: 3,
}).toString();

const button = css({
  display: 'flex',
  padding: 0,
}).toString();

export default {
  image,
  button,
};
