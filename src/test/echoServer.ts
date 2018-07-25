import * as http from "http";
import * as connect from "connect";
import * as querystring from "querystring";
import { IncomingMessage, ServerResponse } from "http";
import { checkForKillCommand } from "../utils";
import { NextFunction } from "connect";

/**
 * Starts an echo server for development and debugging.
 * @param echoServerPort The port number that the echo server will listen on.
 */
export function launchEchoServer(echoServerPort: number) {

    const echoServer = connect();
    echoServer.use(checkForKillCommand);
    echoServer.use(function(req: IncomingMessage, res: ServerResponse) {
        let urlParts = req.url.split("?");

        let returnResponse = () => {
            res.setHeader('Content-Type', 'text/plain');
            res.writeHead(200);
            req.pipe(res);
        };

        if (urlParts.length > 1) {
            const parameters = querystring.parse(urlParts[1]);

            if (parameters.d) {
                res.setHeader('d', parameters.d);
            }
        
            if (parameters.t) {
                res.setHeader('t', parameters.t);
                setTimeout(returnResponse, parameters.t)
            }
            else {
                returnResponse();
            }
            return;
        }

        returnResponse();

    });

    http.createServer(echoServer).listen(echoServerPort);
    console.log("Echo server listening on " + echoServerPort);
};