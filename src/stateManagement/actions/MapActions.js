import {
  MapGetAllData,
  MapGetByName,
  MapUpdateCenter,
  MapUpdateRotate,
  MapUpdateZoom,
} from "./ActionType";

export const getAll = () => ({
  type: MapGetAllData,
});

export const getByName = (name) => ({
  type: MapGetByName,
  payload: name,
});

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
