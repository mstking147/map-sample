import {
  MapGetAllData,
  MapGetByName,
  MapUpdateZoom,
  MapUpdateCenter,
  MapUpdateRotate,
} from "./../actions/ActionType";

const initialState = {
  zoom: 4,
  center: { lng: 55.034, lat: 32.787 },
  rotate: 0,
};

function mapReducer(state = initialState, action) {
  switch (action.type) {
    case MapGetAllData:
      console.log(action.type + " in REDUX*** : ", action);
      return { ...state };
    case MapGetByName:
      console.log(action.type + " in REDUX*** : ", action);
      return { ...state, [action.name]: state[action.name] };
    case MapUpdateZoom:
      if (state.zoom === action.payload) return state;
      console.log(action.type + " in REDUX*** : ", action);
      return { ...state, zoom: action.payload };
    case MapUpdateCenter:
      if (JSON.stringify(state.center) === JSON.stringify(action.payload))
        return state;
      console.log(action.type + " in REDUX*** : ", action);
      return { ...state, center: action.payload };
    case MapUpdateRotate:
      if (state.rotate === action.payload) return state;
      console.log(action.type + " in REDUX*** : ", action);
      return { ...state, rotate: action.payload };
    default:
      return state;
  }
}

export default mapReducer;
