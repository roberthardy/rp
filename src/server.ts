import * as http from "http";
import * as zlib from "zlib";
import { onRequestReceived, onResponseReceived } from './httpHandlers';
import { HttpExchange } from "./models/HttpExchange";
import { RequestOptions } from "https";

const backendHost = "localhost";
const backendPort = 9200;

let log : HttpExchange[] = [];

http.createServer((request, response) => {
    
    let requestBodyBuffer : any[] = [];
    request.on("data", (requestChunk) => {
        requestBodyBuffer.push(requestChunk);
    });
    request.on("end", () => {
        let exchange : HttpExchange = new HttpExchange();

        let requestBody = Buffer.concat(requestBodyBuffer);

        let requestData = onRequestReceived(request, requestBody);
        exchange.request = requestData;

        request.headers["host"] = backendHost;

        let requestOptions : http.RequestOptions = {
            hostname: backendHost,
            host: backendHost,
            port: backendPort,
            path: request.url,
            method: request.method,
            headers: request.headers
        };

        const backendRequest = http.request(requestOptions, (backendResponse) => {
            let responseBodyBuffer : any[] = [];

            backendResponse.on("data", (responseChunk) => {
                responseBodyBuffer.push(responseChunk);
            });

            backendResponse.on("end", () => {
                let responseBody = Buffer.concat(responseBodyBuffer);

                let encoding = backendResponse.headers['content-encoding'];
                if (encoding == 'gzip') {
                    zlib.gunzip(responseBody, function(err, decoded) {
                    responseData.body = decoded.toString();
                    onResponseReceived(backendResponse, responseBody)
                  });
                }
                else if (encoding == 'deflate') {
                    zlib.inflate(responseBody, function(err, decoded) {
                    responseData.body = decoded.toString();
                    onResponseReceived(backendResponse, responseBody)
                  })
                }
                else {
                    onResponseReceived(backendResponse, responseBody)
                }

                let responseData = onResponseReceived(backendResponse, responseBody);

                exchange.response = responseData;

                log.push(exchange);

                if (responseData.status <= 300) {
                    console.log(exchange);
                }
                else {
                    console.error(exchange);
                }
                
                response.writeHead(responseData.status);
                response.write(responseBody);
                response.end();
            });
        });

        backendRequest.write(requestBody);
        backendRequest.end();
    });

}).listen(8080);