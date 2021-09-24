import {
  // MapAddFeature,
  MapBoxUpdateFeatureCollection,
  MapUpdateCenter,
  // MapUpdateFeatureCollection,
  MapUpdateRotate,
  MapUpdateZoom,
  OpenlayersAddFeature,
  OpenlayersRemoveFeature,
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

// export const updateFeatureCollection = (value) => ({
//   type: MapUpdateFeatureCollection,
//   payload: value,
// });

// export const addFeature = (value) => ({
//   type: MapAddFeature,
//   payload: value,
// });

export const openLayersAddFeature = (value) => ({
  type: OpenlayersAddFeature,
  payload: value,
});

export const openLayersRemoveFeature = (id) => ({
  type: OpenlayersRemoveFeature,
  id,
});

export const updateMapBoxFeatureCollection = (value) => ({
  type: MapBoxUpdateFeatureCollection,
  payload: value,
});
