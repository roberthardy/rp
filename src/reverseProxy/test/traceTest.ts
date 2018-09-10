import {spawn, fork, exec, ChildProcess} from "child_process"
import * as path from "path";
import axios, { AxiosPromise } from "axios";
import * as querystring from "querystring";

const reverseProxyPort = 8082;

class TestStep {
    data: string;
    waitTime: number;
    waitForResponse: boolean;

    constructor(data: string, waitTime: number, waitForResponse: boolean) {
        this.data = data;
        this.waitTime = waitTime;
        this.waitForResponse = waitForResponse;
    }

    getUrl() {
        return `http://localhost:${reverseProxyPort}?t=${this.waitTime}&d=${this.data}`;
    }
}

testOverlappingRequests();

async function testOverlappingRequests() {

    let command: string;

    // Launch reverse proxy with echo server.
    const reverseProxyPath = path.join(__dirname, "../", "server.js");
    command = `node ${reverseProxyPath}`;
    let reverseProxyProcess = exec(command, console.error);
    assignEventHandlers(reverseProxyProcess);

    const testSequence: TestStep[] = [
        new TestStep ("a", 500, false),
        new TestStep ("b", 10, true),
        new TestStep ("d", 300, false),
        new TestStep ("c", 20, true),
        new TestStep ("e", 30, true),
        new TestStep ("f", 50, false)
    ];

    let responsesPending: AxiosPromise<any>[] = [];
    testSequence.forEach(async step => {
        let url = step.getUrl();
        if (!step.waitForResponse) {
            responsesPending.push(axios.post(url, step.data));
        }
        else {
            let response = await axios.post(url, step.data);

            if (step.data != response.data) {
                throw `Expected '${step.data}' but received '${response.data}'`;
            }
        }
    });

    axios.all(responsesPending).then(responses => {
        responses.forEach(response => {
            let urlParts = response.request.path.split("?");
            const parameters = querystring.parse(urlParts[1]);

            if (parameters.d != response.data) {
                throw `Expected '${parameters.d}' but received '${response.data}'`;
            }
        });
        console.log("Test complete");
        
        // Allow some time for all responses to be returned before killing the server.
        // TODO: Do this in a less hacky way.
        setTimeout(async function() {await axios.get(`http://localhost:${reverseProxyPort}/kill`)}, 600);

    }).catch(console.error);
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