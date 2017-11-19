import * as http from "http"

http.createServer((request, response) => {
    response.writeHead(200);
    response.write("Hello");
    response.end();
}).listen(8080);