import React, { useState, useContext, useReducer } from "react";
import earthStars from "../earth_stars.json"

const AppContext = React.createContext();



const AppProvider = ({ children }) => {
    const [starData, setStarData] = useState(earthStars);
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
