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
                if (!this._ws)
                    return;
                this._ws.send(JSON.stringify({ type, data }));
            };
            this.close = () => {
                if (!this._ws)
                    return;
                this._ws.close();
                this._ws = null;
            };
            this.addEventListener = (type, callback) => {
                var _a;
                (_a = this._ws) === null || _a === void 0 ? void 0 : _a.addEventListener(type, e => callback(e));
            };
            this.removeEventListener = (type, callback) => {
                var _a;
                (_a = this._ws) === null || _a === void 0 ? void 0 : _a.removeEventListener(type, e => callback(e));
            };
            this._ws = ws;
        }
        get ws() { return this._ws; }
        ;
    }
    exports.WSHelperServer = WSHelperServer;
    class WSSHelperServer extends WSHelper_1.WSHelper {
        constructor(port) {
            super();
            this.clients = {};
            this.send = (type, data) => {
                this.forEachClient(client => client.send(type, data));
            };
            this.close = () => {
                this._wss.close();
            };
            this.addEventListener = (type, callback) => {
                this.forEachClient(client => client.addEventListener(type, e => callback(client, e)));
            };
            this.removeEventListener = (type, callback) => {
                this.forEachClient(client => client.removeEventListener(type, e => callback(client, e)));
            };
            this.onConnected = (callback) => {
                this._wss.on("connection", (ws, req) => callback(this.clients[ws.id], req.socket.remoteAddress));
            };
            this.onDisconnected = (callback) => {
                this._wss.on("close", () => callback());
            };
            this._wss = new ws_1.default.Server({ port });
            this._wss.on("connection", (ws, req) => {
                const id = ws.id = req.headers["sec-websocket-key"];
                const client = new WSHelperServer(ws);
                this.clients[id] = client;
                client.addEventListener("close", () => delete this.clients[id]);
            });
        }
        get wss() { return this._wss; }
        ;
        forEachClient(callback) {
            Object.keys(this.clients).forEach(id => callback(this.clients[id], id));
        }
    }
    exports.WSSHelperServer = WSSHelperServer;
});
//# sourceMappingURL=WSHelperServer.js.map