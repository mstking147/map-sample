import React, { useEffect, useRef, useState } from "react";

import "ol/ol.css";
import "./Openlayers.scss";
import OSM from "ol/source/OSM";
import { Map, View } from "ol";
import { GeoJSON } from "ol/format";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { defaults as DefaultControls } from "ol/control";
import { fromLonLat, toLonLat } from "ol/proj";
import { Draw, Modify, Select, Snap } from "ol/interaction";
import { click } from "ol/events/condition";

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
import { Stroke, Style } from "ol/style";

const OpenLayer = () => {
  const dispatch = useDispatch();
  const mapState = useSelector((state) => state.mapState);
  const map = useRef(null);
  const raster = new TileLayer({
    source: new OSM(),
  });
  const [selectedLine, setSelectedLine] = useState(null);

  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    useSpatialIndex: false,
  });
  const vectorLayer = new VectorLayer({
    name: "draw-in-openlayers",
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: "#ffcc33",
        width: 4,
      }),
    }),
  });

  const modify = new Modify({ source: vectorSource });

  let draw = new Draw({
    source: vectorSource,
    type: "LineString",
  });
  let snap;

  function addInteractions() {
    // draw = new Draw({
    //   source: vectorSource,
    //   type: "LineString",
    // });
    map.current.addInteraction(modify);
    map.current.addInteraction(draw);
    snap = new Snap({ source: vectorSource });
    map.current.addInteraction(snap);
    // draw.on("drawend", function (e) {
    //   console.log("draw change : ", e);
    // });
  }

  // select interaction working on "singleclick"
  const selectSingleClick = new Select({
    layers: [vectorLayer],
    condition: click,
  });

  function selectInteraction() {
    if (selectSingleClick !== null) {
      map.current.removeInteraction(selectSingleClick);
    }

    map.current.addInteraction(selectSingleClick);
  }

  function removeInteraction() {
    console.log("remove");
    map.current.removeInteraction(draw);
    map.current.removeInteraction(snap);
  }

  function removeLine() {
    console.log("remove line : ", selectedLine);
    if (selectedLine) {
      vectorSource.removeFeature(selectedLine);
    }
    // vectorSource.clear();
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
          removeLine
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

    draw.on("drawend", function (e) {
      setTimeout(() => {
        removeInteraction();
      }, 100);
      // console.log("draw change : ", map.current.getLayers().getArray());
      // console.log(
      //   "draw change : ",
      //   map.current.getLayers().getArray()[1].getSource().getFeatures()
      // );
      console.log("draw end : ", e.feature);

      const geom = e.feature.getGeometry();
      console.log("geom: ", geom.getCoordinates());
    });

    modify.on("change", function () {
      console.log("modify change : ", map.current.getLayers().getArray());
    });

    selectInteraction();

    selectSingleClick.on("select", function (e) {
      // console.log("select : ", e.target.getFeatures().remove());
      // console.log(
      //   "&nbsp;" +
      //     e.target.getFeatures().getLength() +
      //     " selected features (last operation selected " +
      //     e.selected.length +
      //     " and deselected " +
      //     e.deselected.length +
      //     " features)"
      // );
      let featureSelected = e.selected[0];
      // console.log("featureSelected : ", featureSelected);
      if (featureSelected) {
        // console.log(
        //   "featureSelected : ",
        //   featureSelected.getGeometry().getCoordinates()
        // );
        // let layer = selectSingleClick.getLayer(featureSelected);
        // console.log("layer : ", layer.get("name")); // here you have the selected layer
        // console.log("Source : ", layer.getSource());
        // console.log("format : ", layer.getSource().format_);

        // console.log(
        //   "here test** : ",
        //   layer.getSource().getFeaturesCollection()
        // );

        // console.log("GeoJSON: ", new GeoJSON().getType(featureSelected));

        setSelectedLine(featureSelected);

        const geoJSON = new GeoJSON().writeFeature(featureSelected, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        console.log("geoJSON : ", JSON.parse(geoJSON));
        mapState.featureCollection;
      }
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

    console.log("draw line in mapbox : ", mapState.featureCollection);
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
