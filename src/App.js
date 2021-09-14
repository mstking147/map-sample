import React, { useEffect, useState } from "react";
import "./App.scss";
import OpenLayer from "./components/openlayer/Openlayer";
import Mapbox from "./components/mapbox/Mapbox";

const App = () => {
  const [zoom, setZoom] = useState(4);
  // const [center, setCenter] = useState([6631573.037813173, 4342785.821733004]);
  const [lat, setLat] = useState(55.034);
  const [lng, setLng] = useState(32.787);
  // const [center, setCenter] = useState([55.034, 32.787]);

  useEffect(() => {
    // setTimeout(() => {
    //   // setZoom(10);
    //   setCenter([10, 20]);
    // }, 3000);
  });

  return (
    <div className="container">
      <OpenLayer zoom={zoom} center={[lat, lng]}></OpenLayer>
      <Mapbox zoom={zoom} lat={lat} lng={lng}></Mapbox>
    </div>
  );
};

export default App;
