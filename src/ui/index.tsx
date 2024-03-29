import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { TrafficTraceContainerConnected } from "./containers/TrafficTraceContainer";
import { loadTraffic } from "./store/reducer";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from 'redux-devtools-extension';

const loggerMiddleware = createLogger();
const store = createStore(
  loadTraffic,
  {},
  composeWithDevTools(applyMiddleware(thunk, loggerMiddleware))
);

render(
  <Provider store={store}>
    <TrafficTraceContainerConnected dispatch={store.dispatch} />
  </Provider>,
  document.getElementById("root")
);
