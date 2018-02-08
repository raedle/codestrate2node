const fork = require('child_process').fork;
const kill = require('tree-kill');
const WebSocket = require('ws');

// run node process as child process and enable IPC to send message
// between the parent and child process for communication
let program = require.resolve('./node-sandbox');
const parameters = [];
const options = {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
};

let childAndWs;

/**
 * Fork new child process to run johnny five
 */
const spawnNodeSandbox = (code, ws) => {
    if (childAndWs) {
        console.log('Killing node sandbox process');
        kill(childAndWs.child.pid);
        childAndWs.ws.close();
    }

    let child = fork(program, parameters, options);

    childAndWs = {
        child,
        ws
    }

    child.on('message', (message) => {
        ws.send(JSON.stringify(message));
    });
    child.send({ cmd: "runCode", code: code });
}

module.exports.open = (port) => {
    const wss = new WebSocket.Server({ port });

    wss.on('connection', function connection(ws) {

        ws.on('open', function open() {
            console.log('client connected');
        });

        ws.on('close', function close() {
            console.log('client disconnected');
        });

        ws.on('message', function incoming(data) {
            // console.log('data', data);
            console.log('received message');

            try {
                let result = JSON.parse(data);
                spawnNodeSandbox(result.code, ws);
            }
            catch (error) {
                console.error(error);

                ws.send(JSON.stringify({
                    type: "console",
                    func: "error",
                    args: [`${error.name}: ${error.message}`]
                }));
            }
        });

        ws.on('error', (error) => {
            console.error(error);
        });
    });
};