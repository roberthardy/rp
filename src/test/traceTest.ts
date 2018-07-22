import {spawn, fork, exec, ChildProcess} from "child_process"
import * as path from "path";
import * as axios from "axios";

testOverlappingRequests();

function testOverlappingRequests() {

    let command: string;

    // Launch reverse proxy with echo server.
    const reverseProxyPath = path.join(__dirname, "../", "server.js");
    command = `node ${reverseProxyPath}`;
    let reverseProxyProcess = exec(command, console.error);
    assignEventHandlers(reverseProxyProcess);
}

function assignEventHandlers(childProcess: ChildProcess) {
    childProcess.stdout.on('data', function(data) {
        console.log(data);
    });
    childProcess.stderr.on('data', function(data) {
        console.error(data);
    });
    childProcess.on('close', function(code) {
        console.log('exited with: ' + code);
    });
}