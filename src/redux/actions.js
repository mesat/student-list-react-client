// import { routerReducer as routing } from "react-router-redux";
import { LOGIN, LOGOUT } from "./actionTypes";


export const signin = () => ({ type: LOGIN });

export const logout = () => ({ type: LOGOUT });
