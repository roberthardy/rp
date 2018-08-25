import * as http from "http";
import * as connect from "connect";
import express = require('express');
import * as path from "path";
import { createTrace } from "./trafficTrace";
import { checkForKillCommand } from "./utils";
import { launchEchoServer } from "./test/echoServer";
import { IncomingMessage, ServerResponse } from "http";
import * as minimist from "minimist";

const echoServerPort = 8083;
const reverseProxyPort = 8082;
const trafficApiPort = 8081;
const inspectorUiPort = 8080;

let target: string;
let disableInspector: boolean = false;

// Parse command line args.
const argv = minimist(process.argv.slice(2));
if (argv._.length < 1 && !argv._[0]) {
    
    // No target specified so launch the echo server.
    target = `http://localhost:${echoServerPort}`;
    launchEchoServer(echoServerPort);
}
else {
    target = argv._[0];
}

if (argv.i) {
    disableInspector = argv.i;
}

console.log(`Intercepting traffic for ${target}`);

const trace = createTrace(target);

// Reverse proxy
const reverseProxy = connect();
reverseProxy.use(checkForKillCommand);
reverseProxy.use(trace.middleware);
http.createServer(reverseProxy).listen(reverseProxyPort,
    () => {console.log(`Reverse proxy listening on ${reverseProxyPort}`)});

const trafficApi = express();
trafficApi.get("/traffic", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    res.writeHead(200);
    res.end(JSON.stringify(trace.traffic));
});
trafficApi.listen(trafficApiPort, () => {console.log(`Traffic API listening on ${trafficApiPort}`)});

// Inspector UI
if (!disableInspector) {
    const inspectorUi = express();
    inspectorUi.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../', 'ui', 'index.html'));
    });
    inspectorUi.use(express.static(path.resolve(__dirname, '../', 'ui')));
    inspectorUi.listen(inspectorUiPort, () => {console.log(`Inspector UI listening on ${inspectorUiPort}`)});
}
else {
    console.log("Inspector UI disabled");
}


function printUsage() {
    console.error("usage: node dist/server.js <target>");
}