import * as http from "http";
import * as connect from "connect";
import * as querystring from "querystring";
import { createTrace } from "./trafficTrace";
import { IncomingMessage, ServerResponse } from "http";

const target = 'http://localhost:8082';
const trace = createTrace(target);

// Reverse proxy
const reverseProxy = connect();
reverseProxy.use(trace.middleware);
http.createServer(reverseProxy).listen(8080);

// Inspector UI
const ui = connect();
ui.use("/traffic", function(req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(trace.traffic));
});
http.createServer(ui).listen(8081);

// Echo server
http.createServer(function(request, response) {
    let urlParts = request.url.split("?");
    
    let returnResponse = () => {
        response.setHeader('Content-Type', 'text/plain');
        response.writeHead(200);
        request.pipe(response);
    };

    if (urlParts.length > 1) {
        const parameters = querystring.parse(urlParts[1]);

        if (parameters.d) {
            response.setHeader('d', parameters.d);
        }
    
        if (parameters.t) {
            response.setHeader('t', parameters.t);
            setTimeout(returnResponse, parameters.t)
        }
        else {
            returnResponse();
        }
        return;
    }

    returnResponse();

}).listen(8082);
