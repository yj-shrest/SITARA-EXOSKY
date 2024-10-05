import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exoplanet from "./pages/Exoplanet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>}></Route>
        <Route exact path="/exoplanet" element={<Exoplanet/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
