import React, { useState, useContext, useReducer } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [selectedPlanet, setSelectedPlanet] = useState({
    });
    return (
    <AppContext.Provider value={{ selectedPlanet, setSelectedPlanet }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider };
