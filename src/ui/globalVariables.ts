import {Store, AnyAction} from "redux"
import {State, fetchSuccess} from "./containers/TrafficTraceContainer"

export function createGlobals(store:Store<State, AnyAction>) {
    (<any>window).store = store;
    (<any>window).fetch = fetchSuccess;
}