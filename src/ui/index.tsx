import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { TrafficTraceContainerConnected, loadTraffic, fetch } from './containers/TrafficTraceContainer';

const store = createStore(loadTraffic)

render(
  <Provider store={store}>
    <TrafficTraceContainerConnected />
  </Provider>,
  document.getElementById('root')
);

store.dispatch(fetch());