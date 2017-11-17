const http = require('http');
const zlib = require('zlib');

const backendHost = "localhost"
const backendPort = 9200

const onResponseReceived = (requestData, responseData, response, buffer) => {
    let responseContent = responseData.body.toString();

    let isJson = responseData.res.headers["content-type"].startsWith("application/json");

    if (isJson && responseContent && responseContent != "") {
        responseContent = JSON.parse(responseContent);
    }

    let httpData = {
        "request" : {
            "method" : requestData.req.method,
            "path" : requestData.req.url,
            "body" : requestData.body.toString()
        },
        "response" : {
            "status" : responseData.res.statusCode,
            "content" : responseContent
        }
    };

    if (responseData.res.statusCode >= 100 && responseData.res.statusCode < 400) {
        console.log(httpData);
    }
    else {
        console.error(httpData);
    }
    
    response.writeHead(responseData.res.statusCode, responseData.res.headers);
    response.write(buffer);
    response.end();
}

const server = http.createServer((request, response) => {

    let requestData = {
        req : request,
        body: []
    }

    let responseData = {
        res : {},
        body : []
    }

    request.on('data', (chunk) => {
        requestData.body.push(chunk);
    }).on('end', () => {
        // Request
        let requestBody = Buffer.concat(requestData.body);

        const options = {
            hostname: backendHost,
            port: backendPort,
            path: requestData.req.url,
            method: requestData.req.method,
            headers: requestData.req.headers,
            encoding: null
        };

        const req = http.request(options, (res) => {
            res.on('data', (chunk) => {
                responseData.body.push(chunk);
            });

            res.on('end', () => {
               
                // Response
                let buffer = Buffer.concat(responseData.body);
                responseData.res = res;

                var encoding = res.headers['content-encoding'];
                if (encoding == 'gzip') {
                  zlib.gunzip(buffer, function(err, decoded) {
                    responseData.body = decoded.toString();
                    onResponseReceived(requestData, responseData, response, buffer)
                  });
                }
                else if (encoding == 'deflate') {
                  zlib.inflate(buffer, function(err, decoded) {
                    responseData.body = decoded.toString();
                    onResponseReceived(requestData, responseData, response, buffer)
                  })
                }
                else {
                    onResponseReceived(requestData, responseData, response, buffer)
                }
            });
          });

          req.write(requestBody);
          req.end();
    });
    
}).listen(3000);
