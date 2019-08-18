import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {  createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from "./reducers";
import { sessionService } from 'redux-react-session';

const store = createStore(rootReducer, undefined, compose(applyMiddleware(thunkMiddleware)));
sessionService.initSessionService(store);
export default store;
