import { IncomingMessage, ServerResponse } from "http";
import * as httpProxy from "http-proxy";
import { HandleFunction, NextFunction } from "connect";
import { RequestData, ResponseData, HttpExchange } from "../common/models";

interface IIdentifyable {
    index : number
}

class TrafficTrace {
    readonly middleware: HandleFunction;
    private currentIndex: number = 0;
    readonly traffic: HttpExchange[] = [];

    constructor(target: string) {
        const self = this;

        const proxy = httpProxy.createProxyServer({
            target: target,
            changeOrigin: true
        });

        this.middleware = function (req: IncomingMessage & IIdentifyable, res: ServerResponse) {

            const exchange : HttpExchange = new HttpExchange();
        
            const requestBodyBuffer : any[] = [];
            req.on("data", requestBodyBuffer.push);
            req.on("end", function() {
        
                const requestBody = Buffer.concat(requestBodyBuffer);
        
                const requestData = onRequestReceived(req, requestBody);
                exchange.request = requestData;
        
                req.index = self.currentIndex++;
                self.traffic[req.index] = exchange;
            });
        
           proxy.web(req, res);
        };
    
        proxy.on('proxyRes', function (proxyRes, req: IncomingMessage & IIdentifyable, res) {
            const body: any[] = [];
            proxyRes.on('data', body.push);
            proxyRes.on('end', function () {
                const responseBody = Buffer.concat(body);
                self.traffic[req.index].response = onResponseReceived(res, responseBody);
            });
        });
    }
}

export function createTrace(target: string): TrafficTrace {
    return new TrafficTrace(target);
}

export function onRequestReceived(request: IncomingMessage, requestBody: Buffer = null) : RequestData {

    const requestData : RequestData = {
        body : null,
        method : request.method,
        path : request.url,
        headers : request.headers
    };

    requestData.body = requestBody && requestBody.toString();
    
    return requestData;
}

export function onResponseReceived(response: ServerResponse, responseBody: Buffer) : ResponseData {

    const responseData : ResponseData = {
        body: null,
        statusCode: response.statusCode,
        headers: response.getHeaders()
    };

    if (responseBody && responseBody.length > 0) {
        responseData.body = responseBody.toString();
    }
    return responseData;
}
