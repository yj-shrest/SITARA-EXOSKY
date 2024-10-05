import React, { useState, useContext, useReducer } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [starData, setStarData] = useState([]);
    const [selectedPlanet, setSelectedPlanet] = useState({});
    return (
    <AppContext.Provider value={{ selectedPlanet, setSelectedPlanet, starData, setStarData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider };
