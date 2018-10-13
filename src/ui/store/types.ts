import { RequestData, ResponseData, HttpExchange } from "../../common/models";

export interface TrafficState {
  readonly exchanges: HttpExchange[];
  readonly isFetching: boolean;
}

export const enum TrafficApiActionTypes {
  FETCH_REQUEST = "@@traffic/FETCH_REQUEST",
  FETCH_SUCCESS = "@@traffic/FETCH_SUCCESS"
}
