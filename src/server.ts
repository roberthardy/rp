import * as http from "http";
import * as connect from "connect";
import express = require('express');
import * as path from "path";
import { createTrace } from "./reverseProxy/trafficTrace";
import { checkForKillCommand } from "./reverseProxy/utils";
import { launchEchoServer } from "./reverseProxy/test/echoServer";
import { IncomingMessage, ServerResponse } from "http";
import * as minimist from "minimist";

const echoServerPort = 8082;
const reverseProxyPort = 8081;
const inspectorUiPort = 8080;

let target: string;

// Parse command line args.
let argv = minimist(process.argv.slice(2));
if (argv._.length < 1 && !argv._[0]) {
    
    // No target specified so launch the echo server.
    target = `http://localhost:${echoServerPort}`;
    launchEchoServer(echoServerPort);
}
else {
    target = argv._[0];
}

console.log(`Intercepting traffic for ${target}`);

const trace = createTrace(target);

// Reverse proxy
const reverseProxy = connect();
reverseProxy.use(checkForKillCommand);
reverseProxy.use(trace.middleware);
http.createServer(reverseProxy).listen(reverseProxyPort);

// Inspector UI
const ui = express();
ui.listen(inspectorUiPort, () => {console.log(`Inspector UI listening on ${inspectorUiPort}`)});
ui.get("/traffic", (req, res) => {
    console.log(__dirname);
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(trace.traffic));
});

ui.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'ui', 'index.html'));
});
ui.use(express.static(__dirname));

function printUsage() {
    console.error("usage: node dist/server.js <target>");
}