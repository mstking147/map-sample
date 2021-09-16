import React from "react";
import "./App.scss";
import OpenLayers from "./components/openlayers/Openlayers";
import Mapbox from "./components/mapbox/Mapbox";

const App = () => {
  return (
    <div className="container">
      <OpenLayers></OpenLayers>
      <Mapbox></Mapbox>
    </div>
  );
};

export default App;
