import React, { useEffect, useState } from "react";

import "ol/ol.css";
import OSM from "ol/source/OSM";

import * as ol from "ol";
import { Map, View } from "ol";
import { GeoJSON, XYZ } from "ol/format";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import {
  Vector as VectorSource,
  OSM as OSMSource,
  XYZ as XYZSource,
  TileWMS as TileWMSSource,
} from "ol/source";
import {
  Select as SelectInteraction,
  defaults as DefaultInteractions,
} from "ol/interaction";
import {
  Attribution,
  ScaleLine,
  ZoomSlider,
  Zoom,
  Rotate,
  MousePosition,
  OverviewMap,
  defaults as DefaultControls,
} from "ol/control";
import {
  Style,
  Fill as FillStyle,
  RegularShape as RegularShapeStyle,
  Stroke as StrokeStyle,
} from "ol/style";
import { Projection, get as getProjection } from "ol/proj";
import { fromLonLat, toLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke } from "ol/style";
import { Draw, Modify, Snap } from "ol/interaction";

const OpenLayer = ({ zoom, center }) => {
  const [map, setMap] = useState(null);
  const raster = new TileLayer({
    source: new OSM(),
  });

  const source = new VectorSource();

  // on component mount
  useEffect(() => {
    console.log("افکت اولی");
    const vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    });
    let mapObject = new Map({
      target: "map",
      layers: [raster, vector],
      // Add in the following map controls
      controls: DefaultControls().extend([new Rotate()]),
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
        enableRotation: true,
        maxZoom: 17,
      }),
    });
    setMap(mapObject);

    // extent = ol.proj.transformExtent(extent, "EPSG:3857", "EPSG:4326");
  }, []);

  // zoom change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom]);

  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(center);
  }, [center]);

  let draw, snap; // global so we can remove them later
  function addInteractions() {
    console.log("addInteractions");
    draw = new Draw({
      source: source,
      type: "LineString",
    });
    draw.on("change", function (e) {
      console.log("draw change : ", e);
    });
    map.addInteraction(draw);
    // snap = new Snap({ source: source });
    // map.addInteraction(snap);
  }

  // moveend listiner on map
  if (map) {
    map.on("moveend", function (e) {
      console.log("e : ", e);
      console.log("center : ", toLonLat(e.frameState.viewState.center));
      console.log("zoom : ", e.frameState.viewState.zoom);
      console.log("rotation : ", e.frameState.viewState.rotation);
    });
  }

  return (
    <div className="col">
      <div
        id="map"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
    </div>
  );
};

export default OpenLayer;
