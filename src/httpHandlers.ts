import * as http from "http";
import { HttpExchange } from "./models/HttpExchange";
import { ResponseData } from "./models/ResponseData";
import { IncomingMessage } from "http";
import { RequestData } from "./models/RequestData";
import * as utils from "./utils";

export function onRequestReceived(request: IncomingMessage, contentBuffer: Buffer) : RequestData {

    let requestData : RequestData = {
        body : null,
        method : request.method,
        path : request.url
    };

    // Uncomment lines 18 to 24 and then comment out line 26 if you want parsed JSON object
    // output to the console instead of raw text.
    // if (contentBuffer && contentBuffer.length > 0) {
    //     if (utils.isContentTypeJson(request.headers)) {
    //         requestData.body = JSON.parse(contentBuffer.toString());
    //     }
    //     else {
    //     }   
    // }

    requestData.body = contentBuffer.toString();
    
    return requestData;
}

export function onResponseReceived(response: IncomingMessage, contentBuffer: Buffer) : ResponseData {

    let responseData : ResponseData = {
        body: null,
        status: response.statusCode
    };

    if (contentBuffer && contentBuffer.length > 0) {
        if (utils.isContentTypeJson(response.headers)) {
            responseData.body = JSON.parse(contentBuffer.toString());
        }
        else {
            responseData.body = contentBuffer.toString();
        }   
    }
    return responseData;
}
