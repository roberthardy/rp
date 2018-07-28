import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import {HandleFunction, NextFunction} from "connect";

export function isContentTypeJson(headers : IncomingHttpHeaders) : boolean {
    if (headers["content-type"]
        && (headers["content-type"].startsWith("application/json")
        || headers["content-type"].startsWith("text/json"))) {
            return true;
    }
    
    return false;
}

/**
 * A middleware that terminates the server process if a request is sent to /kill
 */
export function checkForKillCommand(req: IncomingMessage, res: ServerResponse, next: NextFunction) {
    if (req.url == "/kill") {
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(200);
        res.end("Goodbye");
        console.log("Received kill command");
        process.exit();
    }
    else
        next();
};
