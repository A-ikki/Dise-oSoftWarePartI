// src/components/WifiLoaderComponent.tsx
import React from "react";
import { WifiLoader } from "react-awesome-loaders";

export const WifiLoaderComponent = () => {
  return (
    <div className="wifi-loader-container">
      <WifiLoader
        background={"transparent"}
        desktopSize={"150px"}
        mobileSize={"150px"}
        text={"Cargando..."}
        backColor="#E8F2FC"
        frontColor="#4645F6"
      />
    </div>
  );
};
