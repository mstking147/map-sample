import {
  MapUpdateZoom,
  MapUpdateCenter,
  MapUpdateRotate,
  MapUpdateFeatureCollection,
} from "./../actions/ActionType";

const initialState = {
  zoom: 4,
  center: { lng: 55.034, lat: 32.787 },
  rotate: 0,
  featureCollection: {
    type: "FeatureCollection",
    features: [],
  },
};

function mapReducer(state = initialState, action) {
  switch (action.type) {
    case MapUpdateZoom:
      if (state.zoom === action.payload) return state;
      return { ...state, zoom: action.payload };
    case MapUpdateCenter:
      if (JSON.stringify(state.center) === JSON.stringify(action.payload))
        return state;
      return { ...state, center: action.payload };
    case MapUpdateRotate:
      if (state.rotate === action.payload) return state;
      return { ...state, rotate: action.payload };

    case MapUpdateFeatureCollection:
      return { ...state, featureCollection: action.payload };
    default:
      return state;
  }
}

export default mapReducer;
