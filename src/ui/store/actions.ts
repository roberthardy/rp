import { action } from "typesafe-actions";
import { TrafficApiActionTypes } from "../store/types"
import { Dispatch } from "redux"
import { RequestData, ResponseData, HttpExchange } from "../../common/models";
import axios, { AxiosResponse } from "axios";

export const fetchRequest = () => action(TrafficApiActionTypes.FETCH_REQUEST);
export const fetchSuccess = (data: HttpExchange[]) => action(TrafficApiActionTypes.FETCH_SUCCESS, data);

export function fetchTraffic() {
  return async (dispatch: Dispatch) => {
    dispatch(fetchRequest());
    const response = await axios.get("http://localhost:8081/traffic");
    const data = response.data;
    return dispatch(fetchSuccess(data));
  };
}
