import { logger } from '@shopgate/pwa-core/helpers';

export default (jsonString) => {
  if (!jsonString) {
    return null;
  }

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logger.warn(`parseJson helper was passed a bad parameter error message: ${e.message}`);
    return null;
  }
};
