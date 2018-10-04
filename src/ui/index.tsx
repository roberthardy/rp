import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { TrafficTraceContainerConnected, loadTraffic, fetch } from './containers/TrafficTraceContainer';
import { createGlobals } from './globalVariables'

const store = createStore(loadTraffic);
createGlobals(store);

render(
  <Provider store={store}>
    <TrafficTraceContainerConnected />
  </Provider>,
  document.getElementById('root')
);

store.dispatch(fetch());