var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ws", "./WSHelper"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WSSHelperServer = exports.WSHelperServer = void 0;
    const ws_1 = __importDefault(require("ws"));
    const WSHelper_1 = require("./WSHelper");
    class WSHelperServer extends WSHelper_1.WSHelper {
        constructor(ws) {
            super();
            this.send = (type, data) => {
                if (!this.ws)
                    return;
                this.ws.send(JSON.stringify({ type, data }));
            };
            this.close = () => {
                if (!this.ws)
                    return;
                this.ws.close();
                this.ws = null;
            };
            this.addEventListener = (type, callback) => {
                var _a;
                ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.addEventListener)(type, callback);
            };
            this.removeEventListener = (type, callback) => {
                var _a;
                ((_a = this.ws) === null || _a === void 0 ? void 0 : _a.removeEventListener)(type, callback);
            };
            this.ws = ws;
        }
    }
    exports.WSHelperServer = WSHelperServer;
    class WSSHelperServer extends WSHelper_1.WSHelper {
        constructor(port) {
            super();
            this.clients = [];
            this.send = (type, data) => {
                this.clients.forEach(client => client.send(type, data));
            };
            this.close = () => {
                this.wss.close();
            };
            this.addEventListener = (type, callback) => {
                this.clients.forEach(client => client.addEventListener(type, callback));
            };
            this.removeEventListener = (type, callback) => {
                this.clients.forEach(client => client.removeEventListener(type, callback));
            };
            this.wss = new ws_1.default.Server({ port });
            this.on = this.wss.on;
            this.off = this.wss.off;
            this.wss.on("connection", ws => {
                const client = new WSHelperServer(ws);
                client.addEventListener("close", () => {
                    const index = this.clients.indexOf(client);
                    if (index === -1)
                        return;
                    this.clients.splice(index, 1);
                });
                this.clients.push(client);
            });
        }
    }
    exports.WSSHelperServer = WSSHelperServer;
});
//# sourceMappingURL=WSHelperServer.js.map