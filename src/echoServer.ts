import * as http from "http";
import * as querystring from "querystring";

// Echo server for development and debugging.
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
