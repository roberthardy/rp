import * as React from "react";
import { connect } from "react-redux";
import {
  bindActionCreators,
  Reducer,
  Dispatch,
  AnyAction,
  Action
} from "redux";
import axios, { AxiosResponse } from "axios";
import { RequestData, ResponseData, HttpExchange } from "../../common/models";
import { HttpExchangeBox } from "../components/HttpExchangeBox";
import { action } from "typesafe-actions";

// Additional props for connected React components. This prop is passed by default with `connect()`
export interface ConnectedReduxProps<A extends Action = AnyAction> {
  dispatch: Dispatch<A>;
}

export interface PropsFromState {
  exchanges: HttpExchange[];
}
export interface PropsFromDispatch {
  fetchRequest: typeof fetchRequest;
}
export interface State {
  exchanges: HttpExchange[];
  isFetching: boolean;
}

type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps;

// State
const initialState: State = { exchanges: [], isFetching: false };

/**
 * Reducer
 */
export const loadTraffic: Reducer<State> = (
  state = initialState,
  action
): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, isFetching: true };
    case "FETCH_SUCESS":
      return { ...state, exchanges: action.response, isFetching: false };
    default:
      return state;
  }
};

export const fetchRequest = () => action("FETCH_REQUEST");
export const fetchSuccess = (data: HttpExchange[]) =>
  action("FETCH_SUCCESS", data);

export function fetchTraffic() {
  return (dispatch:Dispatch) => {
    dispatch(fetchRequest());
    return axios
      .get("http://localhost:8081/traffic")
      .then(response => response.data)
      .then(data => dispatch(fetchSuccess(data)));
  };
}

class TrafficTraceContainer extends React.Component<AllProps> {
  constructor(props: AllProps) {
      super(props);
      this.state = initialState;
  }

  componentDidMount() {
    const {dispatch} = this.props;

    dispatch(fetchRequest());
  }

  render() {
    return (
      <div>
        <h1>Traffic trace container</h1>
        <ul>
          {this.props.exchanges && this.props.exchanges.map((exchange, index) => {
            return <HttpExchangeBox key={index} exchange={exchange} />;
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({
  exchanges: state.exchanges
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return { fetchRequest: () => dispatch(fetchRequest()) };
};

export const TrafficTraceContainerConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrafficTraceContainer);
