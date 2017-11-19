import * as http from "http";
import { HttpExchange } from "./models/HttpExchange";
import { ResponseData } from "./models/ResponseData";
import { IncomingMessage } from "http";
import { RequestData } from "./models/RequestData";

export function onRequestReceived(request: IncomingMessage) : RequestData {
    return {
        body: "", method: request.method, path: request.url
    };
}

export function onResponseReceived(response: IncomingMessage) : ResponseData {
    return {body: "" , status: 200};
}
