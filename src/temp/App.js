import React, { useState } from "react";
import "./App.scss";
import OpenLayer from "./components/openlayer/Openlayer";
import Mapbox from "./components/mapbox/Mapbox";

const App = () => {
  return (
    <div className="container">
      <OpenLayer></OpenLayer>
      <Mapbox></Mapbox>
    </div>
  );
};

export default App;
