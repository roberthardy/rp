import * as React from "react";
import axios from "axios";
import { RequestData, ResponseData, HttpExchange } from "../../common/models";
import {HttpExchangeBox} from "../components/HttpExchangeBox";

type Props = {exchanges:HttpExchange[]};

export class TrafficTraceContainer extends React.Component<Props, {exchanges:HttpExchange[]}> {
    constructor(props: Props) {
        super(props);
        this.state = {exchanges: []};
    }

    async componentDidMount() {
        if (this.props.exchanges.length < 1) {
            const traffic = await axios.get("http://localhost:8081/traffic");
            this.setState({exchanges: traffic.data});
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
}