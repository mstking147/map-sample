import {
  MapUpdateZoom,
  MapUpdateCenter,
  MapUpdateRotate,
  MapBoxUpdateFeatureCollection,
  OpenlayersAddFeature,
  OpenlayersRemoveFeature,
} from "./../actions/ActionType";

const initialState = {
  zoom: 4,
  center: { lng: 55.034, lat: 32.787 },
  rotate: 0,
  featureCollection: {
    type: "FeatureCollection",
    features: [],
  },

  mapBoxFeatureCollection: {
    type: "FeatureCollection",
    features: [],
  },
  openlayersFeatureCollection: {
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
    case MapBoxUpdateFeatureCollection:
      return { ...state, mapBoxFeatureCollection: action.payload };

    case OpenlayersAddFeature:
      return {
        ...state,
        openlayersFeatureCollection: {
          ...state.openlayersFeatureCollection,
          features: [
            ...state.openlayersFeatureCollection.features,
            action.payload,
          ],
        },
      };

    case OpenlayersRemoveFeature: {
      for (let feature of state.openlayersFeatureCollection.features) {
        if (feature.id === action.id) {
          state.openlayersFeatureCollection.features;
        }
      }

      const tempFeatures = (state.openlayersFeatureCollection.features =
        state.openlayersFeatureCollection.features.filter((feature) => {
          return feature.id !== action.id;
        }));
      return { ...state, features: tempFeatures };
    }
    default:
      return state;
  }
}

export default mapReducer;
