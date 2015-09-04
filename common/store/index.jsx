import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import { devTools } from 'redux-devtools';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import * as reducers from '../reducers';

let reducer = combineReducers(reducers);

let loggerMiddleware = createLogger({
  collapsed: true,
  level: 'info'
});

let createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
);

let finalCreateStore;
if (process.env.NODE_DEVTOOLS) {
  finalCreateStore = compose(
    createStoreWithMiddleware,
    devTools(),
    createStore
  );
} else {
  finalCreateStore = compose(
    createStoreWithMiddleware,
    createStore
  );
}

export default function configureStore(initialState) {
  return finalCreateStore(reducer, initialState);
}
