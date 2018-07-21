import {spawn, fork, exec} from "child_process"

testOverlappingRequests();

function testOverlappingRequests() {

    var child = exec('node ./server.js');
    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    const reverseProxy = fork('server.js', ["localhost:8082"]);

    console.log("Test");
}