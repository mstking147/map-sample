import React, { useEffect, useRef } from "react";

import "ol/ol.css";
import "./Openlayers.scss";
import OSM from "ol/source/OSM";
import { Map, View } from "ol";
import { GeoJSON } from "ol/format";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { defaults as DefaultControls } from "ol/control";
import { fromLonLat, toLonLat } from "ol/proj";
import { Draw } from "ol/interaction";

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
import CustomControl from "./CustomControl";

const OpenLayer = () => {
  const dispatch = useDispatch();
  const mapState = useSelector((state) => state.mapState);
  const map = useRef(null);
  const raster = new TileLayer({
    source: new OSM(),
  });

  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    name: "draw-in-openlayers",
    source: vectorSource,
  });
  let draw = new Draw({
    source: vectorSource,
    type: "LineString",
  });

  function addInteractions() {
    // draw = new Draw({
    //   source: vectorSource,
    //   type: "LineString",
    // });
    map.current.addInteraction(draw);
    // draw.on("drawend", function (e) {
    //   console.log("draw change : ", e);
    // });
  }

  // on component mount
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new Map({
      target: "map",
      layers: [raster, vectorLayer],
      // layers: [raster],
      controls: DefaultControls().extend([
        new CustomControl(
          {
            className: "draw-line",
            backgroundImage: "url('assets/images/line.svg')",
          },
          addInteractions
        ),
        new CustomControl(
          {
            className: "remove-line",
            backgroundImage: "url('assets/images/trash.svg')",
          },
          addInteractions
        ),
      ]),
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

    draw.on("drawend", function () {
      // console.log("draw change : ", map.current.getLayers().getArray());
      // console.log(
      //   "draw change : ",
      //   map.current.getLayers().getArray()[1].getSource().getFeatures()
      // );
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

  // draw change handler
  useEffect(() => {
    map.current.getLayers().forEach((layer) => {
      if (layer && layer.get("name") === "draw-in-mapbox") {
        map.current.removeLayer(layer);
      }
    });
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(mapState.featureCollection, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });

    const vectorLayer = new VectorLayer({
      name: "draw-in-mapbox",
      source: vectorSource,
    });

    map.current.addLayer(vectorLayer);
  }, [mapState.featureCollection]);

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
