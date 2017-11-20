import * as http from "http";
import { onRequestReceived, onResponseReceived } from './httpHandlers';
import { HttpExchange } from "./models/HttpExchange";
import { RequestOptions } from "https";

const backendHost = "www.theworldsworstwebsiteever.com";
const backendPort = 80;

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
                
                let responseData = onResponseReceived(backendResponse, responseBody);

                exchange.response = responseData;

                log.push(exchange);

                if (responseData.status <= 200) {
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