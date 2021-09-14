import React, { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Mapbox.scss";
import mapboxgl, { setRTLTextPlugin } from "!mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9zdGFmYWciLCJhIjoiY2p4Mnhqa3RuMGUzaDQ5bnM0bWcwMjR2ZSJ9.E4TKbWMDP962nfX-ai8xNA";

setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js"
);

const Mapbox = ({ zoom, lat, lng }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // const [lng, setLng] = useState(-70.9);
  // const [lat, setLat] = useState(42.35);
  // const [zoom, setZoom] = useState(9);

  // // zoom change handler
  // useEffect(() => {
  //   if (!map) return;
  //   map.getView().setZoom(zoom);
  // }, [zoom]);

  // // center change handler
  // useEffect(() => {
  //   if (!map) return;
  //   map.getView().setCenter(center);
  // }, [center]);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lat, lng],
      zoom: zoom - 1,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("moveend", (e) => {
      console.log("MapBox here start *****************", e);
      console.log("center : ", map.current.getCenter());
      console.log("zoom : ", map.current.getZoom());
      console.log("MapBox here end *****************");
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    console.log("map : ", map.current.setLayoutProperty);
    map.current.addControl(new mapboxgl.NavigationControl());
    // map.current.setLayoutProperty("country-label", "text-field", [
    //   "get",
    //   `name_fa`,
    // ]);
  }, [map]);

  return (
    <div className="col">
      <div ref={mapContainer} className="mapbox-container" />
    </div>
  );
};

export default Mapbox;
