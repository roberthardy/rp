export interface RequestData {
    method: string;
    path: string;
    body: any;
}

export interface ResponseData {
    status: number;
    body: any;
}

export class HttpExchange {
    request: RequestData;
    response: ResponseData;
}
