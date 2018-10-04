import {Store} from "redux"
import {State, Action, fetch} from "./containers/TrafficTraceContainer"

export function createGlobals(store:Store<State, Action>) {
    (<any>window).store = store;
    (<any>window).fetch = fetch;
}