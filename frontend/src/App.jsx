import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exoplanet from "./pages/Exoplanet";
import Stars from "./components/Exoplanet/Stars";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/exoplanet" element={<Exoplanet/>}></Route>
        <Route exact path="/stars" element={<Stars ra={10} dec={40}/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
