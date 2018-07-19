import * as http from "http";
import * as connect from "connect";
import { createTrace } from "./trafficTrace";
import { IncomingMessage, ServerResponse } from "http";
import * as minimist from "minimist";

// Parse command line args.
let argv = minimist(process.argv.slice(2));
if (argv._.length < 1 && !argv._[0]){
    printUsage();
    process.exit(1);
}

let target: string = argv._[0];

console.log(`Intercepting traffic for ${target}`);

const trace = createTrace(target);

// Reverse proxy
const reverseProxy = connect();
reverseProxy.use(trace.middleware);
http.createServer(reverseProxy).listen(8080);

// Inspector UI
const ui = connect();
ui.use("/traffic", function(req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(trace.traffic));
});
http.createServer(ui).listen(8081);

function printUsage() {
    console.error("usage: node server.js <target>");
}