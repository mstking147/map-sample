import {
  MapAddFeature,
  MapUpdateCenter,
  MapUpdateFeatureCollection,
  MapUpdateRotate,
  MapUpdateZoom,
} from "./ActionType";

export const updateZoom = (value) => ({
  type: MapUpdateZoom,
  payload: value,
});

export const updateCenter = (value) => ({
  type: MapUpdateCenter,
  payload: value,
});

export const updateRotate = (value) => ({
  type: MapUpdateRotate,
  payload: value,
});

export const updateFeatureCollection = (value) => ({
  type: MapUpdateFeatureCollection,
  payload: value,
});

export const addFeature = (value) => ({
  type: MapAddFeature,
  payload: value,
});
