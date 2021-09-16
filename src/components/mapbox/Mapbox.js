import React, { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Mapbox.scss";
import mapboxgl, { setRTLTextPlugin } from "!mapbox-gl";

import {
  MapUpdateZoom,
  MapUpdateCenter,
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

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: mapState.center,
      zoom: mapState.zoom - 1,
      boxZoom: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

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
    });
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

  return (
    <div className="col">
      <div ref={mapContainer} className="mapbox-container" />
    </div>
  );
};

export default Mapbox;
