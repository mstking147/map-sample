import React, { useEffect, useRef } from "react";
import "./Mapbox.scss";
import mapboxgl, { setRTLTextPlugin } from "!mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import {
  MapUpdateZoom,
  MapUpdateCenter,
  MapUpdateRotate,
  MapUpdateFeatureCollection,
} from "./../../stateManagement/actions/ActionType";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9zdGFmYWciLCJhIjoiY2p4Mnhqa3RuMGUzaDQ5bnM0bWcwMjR2ZSJ9.E4TKbWMDP962nfX-ai8xNA";

setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js"
);

const Mapbox = () => {
  const dispatch = useDispatch();
  const mapState = useSelector((state) => state.mapState);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = new MapboxDraw({
    boxSelect: false,
    controls: {
      polygon: false,
      combine_features: false,
      uncombine_features: false,
      point: false,
    },
  });

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: mapState.center,
      zoom: mapState.zoom - 1,
      boxZoom: false,
      maxPitch: 0,
      // dragRotate: false,
      // touchZoomRotate: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl());
    map.current.addControl(draw);

    map.current.on("moveend", (e) => {
      if (!e.originalEvent) return;
      dispatch({
        type: MapUpdateCenter,
        payload: map.current.getCenter(),
      });
      dispatch({
        type: MapUpdateZoom,
        payload: map.current.getZoom() + 1,
      });
      dispatch({
        type: MapUpdateRotate,
        payload: -map.current.getBearing(),
      });
    });

    map.current.on("draw.create", dispatchDraw);
    map.current.on("draw.delete", dispatchDraw);
    map.current.on("draw.update", dispatchDraw);

    function dispatchDraw() {
      dispatch({
        type: MapUpdateFeatureCollection,
        payload: draw.getAll(),
      });
    }
  });

  // zoom change handler
  useEffect(() => {
    if (map.current.getZoom() + 1 === mapState.zoom) {
      return;
    }
    map.current.jumpTo({ zoom: mapState.zoom - 1 });
  }, [mapState.zoom]);

  // center change handler
  useEffect(() => {
    if (
      JSON.stringify(map.current.getCenter()) ===
      JSON.stringify(mapState.center)
    ) {
      return;
    }
    map.current.jumpTo({ center: [mapState.center.lng, mapState.center.lat] });
  }, [JSON.stringify(mapState.center)]);

  // rotate change handler
  useEffect(() => {
    if (map.current.getBearing() === -mapState.rotate) {
      return;
    }
    map.current.setBearing(-mapState.rotate);
  }, [mapState.rotate]);

  return (
    <div className="col">
      <div ref={mapContainer} className="mapbox-container" />
    </div>
  );
};

export default Mapbox;
