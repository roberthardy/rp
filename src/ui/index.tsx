import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { TrafficTraceContainerConnected, loadTraffic, fetchSuccess, fetchRequest } from './containers/TrafficTraceContainer';
import { createGlobals } from './globalVariables'
import {Dispatch, AnyAction} from 'redux'
import { createLogger } from 'redux-logger'

const loggerMiddleware = createLogger();
const store = createStore(loadTraffic, {}, applyMiddleware(thunk, loggerMiddleware));
createGlobals(store);

render(
  <Provider store={store}>
    <TrafficTraceContainerConnected dispatch={store.dispatch} />
  </Provider>,
  document.getElementById('root')
);

//store.dispatch(fetchRequest());