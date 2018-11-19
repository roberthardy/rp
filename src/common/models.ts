import { IncomingHttpHeaders } from "http";

export interface RequestData {
    method: string;
    path: string;
    body: any;
    headers: IncomingHttpHeaders;
}

export interface ResponseData {
    status: number;
    body: any;
}

export class HttpExchange {
    request: RequestData;
    response: ResponseData;
}
