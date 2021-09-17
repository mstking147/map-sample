import React, { useEffect, useRef } from "react";

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

import {
  MapUpdateCenter,
  MapUpdateRotate,
  MapUpdateZoom,
} from "./../../stateManagement/actions/ActionType";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import {
  radianToDegree,
  degreeToRadian,
} from "./../../shared/functions/covert.functions";

const OpenLayer = () => {
  const dispatch = useDispatch();
  const mapState = useSelector((state) => state.mapState);
  const map = useRef(null);

  const raster = new TileLayer({
    source: new OSM(),
  });

  const source = new VectorSource();

  // on component mount
  useEffect(() => {
    if (map.current) return; // initialize map only once
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
    map.current = new Map({
      target: "map",
      layers: [raster, vector],
      // Add in the following map controls
      controls: DefaultControls(),
      view: new View({
        center: fromLonLat([mapState.center.lng, mapState.center.lat]),
        zoom: mapState.zoom,
        enableRotation: true,
      }),
    });

    map.current.on("moveend", () => {
      const mapView = map.current.getView();
      const center = toLonLat(mapView.getCenter());
      dispatch({
        type: MapUpdateCenter,
        payload: {
          lng: center[0],
          lat: center[1],
        },
      });
      dispatch({
        type: MapUpdateZoom,
        payload: mapView.getZoom(),
      });
      dispatch({
        type: MapUpdateRotate,
        payload: radianToDegree(mapView.getRotation()),
      });
    });
  });

  // zoom change handler
  useEffect(() => {
    const mapView = map.current.getView();
    if (mapView.getZoom() === mapState.zoom) {
      return;
    }
    mapView.setZoom(mapState.zoom);
  }, [mapState.zoom]);

  // center change handler
  useEffect(() => {
    const mapView = map.current.getView();
    const currentCenter = toLonLat(mapView.getCenter());
    const newCenter = fromLonLat([mapState.center.lng, mapState.center.lat]);
    if (JSON.stringify(currentCenter) === JSON.stringify(newCenter)) {
      return;
    }
    map.current.getView().setCenter(newCenter);
  }, [JSON.stringify(mapState.center)]);

  // rotate change handler
  useEffect(() => {
    const mapView = map.current.getView();
    const rotateTemp = radianToDegree(mapView.getRotation());
    if (rotateTemp === mapState.rotate) {
      return;
    }
    mapView.setRotation(degreeToRadian(mapState.rotate));
  }, [mapState.rotate]);

  let draw, snap; // global so we can remove them later
  function addInteractions() {
    // console.log("addInteractions");
    draw = new Draw({
      source: source,
      type: "LineString",
    });
    draw.on("change", function (e) {
      // console.log("draw change : ", e);
    });
    map.addInteraction(draw);
    // snap = new Snap({ source: source });
    // map.addInteraction(snap);
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
