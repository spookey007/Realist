import { isMobile, isTablet } from 'react-device-detect';

export const getDeviceType = () => {
  if (isMobile || isTablet) {
    return 'mobile';
  } else {
    return 'desktop';
  }
};