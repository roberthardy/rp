const http = require('http');
const backendServer = "http://"

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
        requestData.body = Buffer.concat(requestData.body).toString();

        const options = {
            hostname: 'www.google.com',
            port: 80,
            path: requestData.req.url,
            method: requestData.req.method,
            headers: requestData.req.headers
        };

        const req = http.request(options, (res) => {
            res.on('data', (chunk) => {
                responseData.body.push(chunk);                
            });
            res.on('end', () => {
                // Response
                responseData.body = Buffer.concat(responseData.body).toString();
                responseData.res = res;

                let httpData = {
                    "request" : {
                        "method" : requestData.req.method,
                        "path" : requestData.req.url,
                        "body" : requestData.body
                    },
                    "response" : {
                        "status" : res.statusCode,
                        "content" : responseData.body
                    }
                };

                if (httpData.statusCode >= 200 && httpData.statusCode < 400) {
                    console.log(httpData);
                }
                else {
                    console.error(httpData);
                }

                
                response.end();        
            });
          });

          req.end();
    });
    
}).listen(3000);
