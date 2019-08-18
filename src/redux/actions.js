// // import { routerReducer as routing } from "react-router-redux";
// import { LOGIN, LOGOUT } from "./actionTypes";


// export const signin = () => ({ type: LOGIN });

// export const logout = () => ({ type: LOGOUT });


  
import { sessionService } from 'redux-react-session';
import * as sessionApi from '../api/sessionApi';

export const login = (user, history) => {
  return () => {
    return sessionApi.login(user).then(response => {
      const { token } = response;
      sessionService.saveSession({ token })
      .then(() => {
        sessionService.saveUser(response.data)
        .then(() => {
          history.push('/');
        }).catch(err => console.error(err));
      }).catch(err => console.error(err));
    }).catch(err => {console.error(err);history.push('/login');});
  };
};

export const logout = (history) => {
  return () => {
    return sessionApi.logout().then(() => {
      sessionService.deleteSession();
      sessionService.deleteUser();
      history.push('/login');
    }).catch(err => {
      throw (err);
    });
  };
};