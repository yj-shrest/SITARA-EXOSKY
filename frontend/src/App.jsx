import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./components/Context";
import Home from "./pages/Home";
import Exoplanet from "./pages/Exoplanet";
import SkyMap2D from "./pages/SkyMap2D";
function App() {
  return (
     <AppProvider>
      
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/exoplanet/:planetName" element={<Exoplanet/>}></Route>
        <Route exact path="/skymap2d" element={<SkyMap2D/>}></Route>
      </Routes>
    </BrowserRouter>
     </AppProvider>
  );
}

export default App;
