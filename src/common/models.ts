import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";

export interface RequestData {
    method: string;
    path: string;
    body: any;
    headers: IncomingHttpHeaders;
}

export interface ResponseData {
    statusCode: number;
    body: any;
    headers: OutgoingHttpHeaders;
}

export class HttpExchange {
    request: RequestData;
    response: ResponseData;
}
