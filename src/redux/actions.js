// // import { routerReducer as routing } from "react-router-redux";
// import { LOGIN, LOGOUT } from "./actionTypes";


// export const signin = () => ({ type: LOGIN });

// export const logout = () => ({ type: LOGOUT });


  
import { sessionService } from 'redux-react-session';
import * as sessionApi from '../api/sessionApi';
import { UPLOAD_RESPONSE } from './actionTypes';
import type from 'os'
import { Array } from 'core-js';

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

const uploadModel = ({ resp  }) => ({

  type: UPLOAD_RESPONSE,
  payload: {
    response: resp, 
    uploaded: resp===null?false:true
    }
}); 

export const upload = (resp) => (dispatch) => {
  console.log('response')

  console.log(resp)
  console.log(uploadModel({resp}))
  return dispatch(uploadModel({resp}))
}


