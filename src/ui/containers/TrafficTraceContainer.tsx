import * as React from "react";
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux'
import axios, { AxiosResponse } from "axios";
import { RequestData, ResponseData, HttpExchange } from "../../common/models";
import {HttpExchangeBox} from "../components/HttpExchangeBox";

export interface Props {exchanges:HttpExchange[]};
export interface State {exchanges:HttpExchange[]};
export interface Action {type: string, response: HttpExchange[]};
// State
const initialState:State = {exchanges: []};

export const loadTraffic = (state:State = initialState, action: Action): State => {
    switch (action.type) {
        case "LOAD_TRAFFIC":
            return {exchanges: action.response};
        default:
            return state;
    }
};

export const fetch = () => {
    let response:HttpExchange[] = [
        {
            request: {body: "abc", method: "POST", path: "/"},
            response: {body: "def", status:200}
        }
    ];
    return {
        type:"LOAD_TRAFFIC",
        response: response
    }
};

class TrafficTraceContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = initialState;
    }

    async componentDidMount() {
        if (this.props.exchanges.length < 1) {
            //const traffic = await axios.get("http://localhost:8081/traffic");
        }
    }

    render() {
        return (
            <div>
                <h1>Traffic trace container</h1>
                <ul>
                    {this.props.exchanges.map((exchange, index) => {
                        return <HttpExchangeBox key={index} exchange={(exchange)} />;
                    })}
                </ul>
            </div>
        );
    }
};

const mapStateToProps = (state: State) => ({
    exchanges: state.exchanges
});

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {fetch: () => dispatch(fetch())};
};
  
export const TrafficTraceContainerConnected = connect(mapStateToProps, mapDispatchToProps)(TrafficTraceContainer);