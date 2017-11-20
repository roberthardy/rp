import { IncomingHttpHeaders } from "http";

export function isContentTypeJson(headers : IncomingHttpHeaders) : boolean {
    if (headers["content-type"]
        && (headers["content-type"].startsWith("application/json")
        || headers["content-type"].startsWith("text/json"))) {
            return true;
    }
    
    return false;
}