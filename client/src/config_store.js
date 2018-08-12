import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { localeReducer } from 'react-localize-redux'
import createSagaMiddleware from 'redux-saga'
import { etheremonStoreReducers } from './reducers'
import { LanInitialActions } from './config_language.js'
import rootSagas from './sagas'

export const setupStore = () => {
  // Create the saga middleware
  const sagaMiddleware = createSagaMiddleware();

  // Creating store
  const reducer = combineReducers({...etheremonStoreReducers, localeReducer});
  const initialState = {};
  const enhancer = compose(applyMiddleware(sagaMiddleware));
  let store = createStore(reducer, initialState, enhancer);
  store.sagaMiddleware = sagaMiddleware;

  // Initial Actions
  LanInitialActions.forEach(a => store.dispatch(a));
  sagaMiddleware.run(rootSagas);

  return store;
};
