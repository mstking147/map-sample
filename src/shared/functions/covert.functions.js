import { GeoJSON } from "ol/format";

export function radianToDegree(radian) {
  return radian * (180 / Math.PI);
}

export function degreeToRadian(degree) {
  return degree * (Math.PI / 180);
}

export function toGeoJSON(feature) {
  const geoJSON = new GeoJSON().writeFeature(feature, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
  });
  return JSON.parse(geoJSON);
}
