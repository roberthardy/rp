import { IncomingMessage, ServerResponse } from "http";
import * as httpProxy from "http-proxy";
import { HandleFunction, NextFunction } from "connect";
import { HttpExchange } from "./models/HttpExchange";
import { ResponseData } from "./models/ResponseData";
import { RequestData } from "./models/RequestData";

interface IIdentifyable {
    id : number
}

class TrafficTrace {
    readonly middleware: HandleFunction;
    private currentId: number = 0;
    traffic: { [id:number]:HttpExchange } = {};

    constructor(target: string) {
        let self = this;

        const proxy = httpProxy.createProxyServer({
            target: target,
            changeOrigin: true
        });

        this.middleware = function (req: IncomingMessage & IIdentifyable, res: ServerResponse, next: NextFunction) {
            let exchange : HttpExchange = new HttpExchange();
        
            let requestBodyBuffer : any[] = [];
            req.on("data", (requestChunk: any) => {
                requestBodyBuffer.push(requestChunk);
            });
            req.on("end", function() {
        
                let requestBody = Buffer.concat(requestBodyBuffer);
        
                let requestData = onRequestReceived(req, requestBody);
                exchange.request = requestData;
        
                req.id = self.currentId++;
                self.traffic[req.id] = exchange;
            });
        
           proxy.web(req, res);
        };
    
        proxy.on('proxyRes', function (proxyRes, req: IncomingMessage & IIdentifyable, res) {
            var body: any[] = [];
            proxyRes.on('data', function (data) {
                body.push(data);
            });
            proxyRes.on('end', function () {
                let responseBody = Buffer.concat(body);
                self.traffic[req.id].response = onResponseReceived(res, responseBody);
                console.log(self.traffic[req.id]);
            });
        });
    }
}

export function createTrace(target: string): TrafficTrace {
    return new TrafficTrace(target);
}

function onRequestReceived(request: IncomingMessage, contentBuffer: Buffer) : RequestData {

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

function onResponseReceived(response: ServerResponse, contentBuffer: Buffer) : ResponseData {

    let responseData : ResponseData = {
        body: null,
        status: response.statusCode
    };

    if (contentBuffer && contentBuffer.length > 0) {
        responseData.body = contentBuffer.toString();
    }
    return responseData;
}
