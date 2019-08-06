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

const backDrop = css({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
}).toString();

export default {
  image,
  button,
  backDrop,
};
