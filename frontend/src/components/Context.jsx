import React, { useState, useContext, useReducer } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    const [starData, setStarData] = useState([]);
    const [selectedPlanet, setSelectedPlanet] = useState({});
    const [selectedPoints, setSelectedPoints] = useState([]);
    return (
    <AppContext.Provider value={{ selectedPlanet, setSelectedPlanet, starData, setStarData, selectedPoints, setSelectedPoints }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider };
