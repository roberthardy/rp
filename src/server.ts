import * as http from "http"

http.createServer((request, response) => {
    let requestBodyBuffer : Array<string | Buffer> = [];
    request.on("data", (chunk) => {
        requestBodyBuffer.push(chunk);
    });
    request.on("end", () => {

    });

    response.writeHead(200);
    response.write("Hello");
    response.end();
}).listen(8080);