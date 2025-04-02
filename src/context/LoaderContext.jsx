import React, { createContext, useContext, useState } from "react";
import FullPageLoader from "../components/FullPageLoader";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // 👈 Start as true!

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <FullPageLoader />} {/* 👈 This is what shows the loader */}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
