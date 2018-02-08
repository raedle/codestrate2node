const util = require('util');
const vm = require('vm');

/**
 * Proxy the console object for sending console logs back to the executing codestrate
 * environment.
 */
const proxiedConsole = new Proxy(console, {
    get: function (target, name) {
        let value = console[name];
        if (typeof value === 'function') {
            return function (...args) {
                sendMessage({ type: "console", func: name, args: args });
                return value.call(this, ...args);
            };
        }
        return value;
    }
});

/**
 * Proxy the data object.
 * 
 * @param {*} selector The data paragraph selector within a codestrate, e.g., '#data-paragraph'.
 */
const proxiedData = (selector) => {
    return new Proxy({}, {
        get: function (target, name) {
            if (name === 'set') {
                return function (key, value) {
                    return sendMessage({ type: "data", selector, key, value });
                };
            }
            return undefined;
        }
    });
};

/**
 * Send message to parent process.
 * 
 * @param {*} message 
 */
const sendMessage = (message) => {
    process.send(message);
};

/**
 * Communication between parent and child process.
 */
process.on('message', (message) => {

    if (message.cmd === "runCode") {
        let { code } = message;
        runCodeInSandbox(code);
    }
});

/**
 * Runs the node code in a sandboxed environment.
 * 
 * @param {*} code The node code
 */
const runCodeInSandbox = (code) => {
    const sandbox = {
        console: proxiedConsole,
        data: proxiedData
    };
    vm.createContext(sandbox);

    code = `
(function(require) {
    try {
        ${code}
    }
    catch (error) {
        console.error(error);
    }
})`;

    // run code in sandbox environment to avoid access to local and global
    // scope of hosting node process
    (async () => {
        vm.runInContext(code, sandbox)(require);
    })();
};