import { LOGIN, LOGOUT } from "../actionTypes";

const authReducer = (state = { isAuthenticated: false }, { type }) => {
  switch (type) {
    case LOGIN:
        console.log(`type: ${type} , state: ${state.isAuthenticated}`)
      return { ...state, isAuthenticated: true };
    case LOGOUT:
            console.log(state)
            console.log(`type: ${type} , state: ${state.isAuthenticated}`)
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
};
export default authReducer;