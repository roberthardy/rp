import { action } from "typesafe-actions";
import { TrafficApiActionTypes } from "../store/types"
import { Dispatch } from "redux"
import { HttpExchange } from "../../common/models";
import axios from "axios";

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
