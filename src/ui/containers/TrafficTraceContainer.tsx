import * as React from "react";
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux'
import axios, { AxiosResponse } from "axios";
import { RequestData, ResponseData, HttpExchange } from "../../common/models";
import {HttpExchangeBox} from "../components/HttpExchangeBox";

interface Props {exchanges:HttpExchange[]};
interface State {exchanges:HttpExchange[]};

export const loadTraffic = (state:State = {exchanges: []}, action: {type: string, response: HttpExchange[]}): State => {
    switch (action.type) {
        case "LOAD_TRAFFIC":
            return {exchanges: action.response};
        default:
            return state;
    }
};

export const fetch = () => {return {type:"LOAD_TRAFFIC", response: [new HttpExchange()]}};

class TrafficTraceContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {exchanges: []};
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
                    {this.state.exchanges.map((exchange, index) => {
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

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    fetch: fetch,
  }, dispatch);
  
export const TrafficTraceContainerConnected = connect(mapStateToProps, mapDispatchToProps)(TrafficTraceContainer);