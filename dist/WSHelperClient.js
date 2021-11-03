(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./WSHelper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WSHelperClient = void 0;
    const WSHelper_1 = require("./WSHelper");
    class WSHelperClient extends WSHelper_1.WSHelper {
        constructor(url, retryMS = 1000) {
            super();
            this.url = url;
            this.retryMS = retryMS;
            this.listeners = {};
            this.send = (type, data) => {
                if (!this.ws)
                    return;
                this.ws.send(JSON.stringify({ type, data }));
            };
            this.open = () => {
                if (this.ws)
                    return;
                this.ws = new WebSocket(this.url);
                Object.keys(this.listeners).forEach(lType => {
                    this.listeners[lType].forEach(listener => { var _a; return (_a = this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener(lType, listener); });
                });
                this.ws.addEventListener("open", () => {
                    console.log(`Socket to ${this.url} connected`);
                });
                this.ws.addEventListener("close", e => {
                    console.log(`Socket to ${this.url} is closed. Reconnect will be attempted in ${this.retryMS / 1000} second(s).`, e.reason);
                    setTimeout(() => {
                        this.open();
                    }, this.retryMS);
                });
                this.ws.addEventListener("error", e => {
                    console.error(`Socket to ${this.url} encountered error: `, e.message, "Closing socket");
                    this.close();
                });
            };
            this.close = () => {
                if (!this.ws)
                    return;
                this.ws.close();
                this.ws = null;
            };
            this.addEventListener = (type, callback) => {
                var _a;
                if (!this.listeners[type])
                    this.listeners[type] = [];
                const listeners = this.listeners[type];
                if (listeners.indexOf(callback) === -1)
                    listeners.push(callback);
                (_a = this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener(type, callback);
            };
            this.removeEventListener = (type, callback) => {
                var _a;
                if (!this.listeners[type])
                    this.listeners[type] = [];
                const listeners = this.listeners[type];
                const index = listeners.indexOf(callback);
                if (index !== -1)
                    listeners.splice(index, 1);
                (_a = this.ws) === null || _a === void 0 ? void 0 : _a.removeEventListener(type, callback);
            };
            this.ws = new WebSocket(url);
        }
    }
    exports.WSHelperClient = WSHelperClient;
});
//# sourceMappingURL=WSHelperClient.js.map