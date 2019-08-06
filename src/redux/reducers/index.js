import { combineReducers } from "redux";
import authReducer from "./authReducer";
// import { routerReducer as routing } from "react-router-redux";


export default combineReducers({
  auth:authReducer
  // routing
});