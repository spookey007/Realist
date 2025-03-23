import React, { createContext, useContext, useMemo } from "react";
import { getDeviceType } from "../components/utils/deviceDetector";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const deviceType = useMemo(() => getDeviceType(), []);
  const isMobile = deviceType === "mobile";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop";

  return (
    <DeviceContext.Provider value={{ deviceType, isMobile, isTablet, isDesktop }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
