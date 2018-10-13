import { Reducer } from "redux";
import { TrafficState, TrafficApiActionTypes } from "../store/types";

const initialState: TrafficState = { exchanges: [], isFetching: false };

/**
 * Reducer
 */
export const loadTraffic: Reducer<TrafficState> = (
  state = initialState,
  action
): TrafficState => {
  switch (action.type) {
    case TrafficApiActionTypes.FETCH_REQUEST:
      return { ...state, isFetching: true };
    case TrafficApiActionTypes.FETCH_SUCCESS:
      return { ...state, exchanges: action.payload, isFetching: false };
    default:
      return state;
  }
};
