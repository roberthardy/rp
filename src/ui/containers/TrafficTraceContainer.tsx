import {Component} from "react";
import axios from "axios";
import { RequestData, ResponseData, HttpExchange } from "../../common/models";

class TrafficTraceContainer extends Component<{[id:number]:HttpExchange }> {
    constructor(props:{ [id:number]:HttpExchange }) {
        super(props);
    }

    async componentDidMount() {
        const traffic = await axios.get("/traffic");
    }
}