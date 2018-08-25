import * as React from "react";import axios from "axios";
import { RequestData, ResponseData, HttpExchange } from "../../common/models";

export class TrafficTraceContainer extends React.Component<{}, {[id:number]:HttpExchange}> {
    constructor(props:{ [id:number]:HttpExchange }) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const traffic = await axios.get("http://localhost:8081/traffic");
        this.setState(traffic.data);
    }

    render() {
        return <p>Traffic trace container</p>;
    }
}