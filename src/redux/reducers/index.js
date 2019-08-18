import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { sessionReducer } from 'redux-react-session';
// import { routerReducer as routing } from "react-router-redux";


export default combineReducers({
  auth:authReducer,
  session:sessionReducer
  // routing
});