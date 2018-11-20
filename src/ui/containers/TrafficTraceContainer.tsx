import * as React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Dispatch, AnyAction } from "redux";
import { HttpExchangeBox } from "../components/HttpExchangeBox";
import { HttpExchange } from "../../common/models";
import { TrafficState } from "../store/types";
import { fetchRequest, fetchTraffic } from "../store/actions";

export interface ConnectedReduxProps {
  dispatch: ThunkDispatch<TrafficState, void, AnyAction>;
}

/**
 * Props passed from `mapStateToProps`.
 */
interface PropsFromState {
  exchanges: HttpExchange[];
}

/**
 * Props passed from `mapDispatchToProps`.
 */
interface PropsFromDispatch {
  fetchRequest: typeof fetchRequest;
}

type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps;

const initialState: TrafficState = { exchanges: [], isFetching: false };

class TrafficTraceContainer extends React.Component<AllProps> {
  constructor(props: AllProps) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(fetchTraffic());
  }

  render() {
    return (
      <div>
        <h1>Traffic trace container</h1>
        <table>
          <tbody>
            {this.props.exchanges &&
              this.props.exchanges.map((exchange, index) => {
                return <HttpExchangeBox key={index} exchange={exchange} />;
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state: TrafficState) => ({
  exchanges: state.exchanges
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return { fetchRequest: () => dispatch(fetchRequest()) };
};

export const TrafficTraceContainerConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrafficTraceContainer);
