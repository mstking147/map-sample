import React from "react";

import "ol/ol.css";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";

const OpenLayer = () => {
  const map = new Map({
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    target: "map",
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });

  return (
    <div className="col">
      <a className="skiplink" href="#map">
        Go to map
      </a>
      <div id="map" className="map" tabIndex="0"></div>
      <button id="zoom-out">Zoom out</button>
      <button id="zoom-in">Zoom in</button>
    </div>
  );
};

export default OpenLayer;
