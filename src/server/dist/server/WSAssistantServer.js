"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSSAssistantServer = exports.WSAssistantServer = void 0;
const WSAssistant_1 = require("../shared/WSAssistant");
const ws_1 = __importDefault(require("ws"));
class WSAssistantServer extends WSAssistant_1.WSAssistant {
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
            this._ws?.addEventListener(type, e => callback(e));
        };
        this.removeEventListener = (type, callback) => {
            this._ws?.removeEventListener(type, e => callback(e));
        };
        this._ws = ws;
    }
    get ws() { return this._ws; }
    ;
}
exports.WSAssistantServer = WSAssistantServer;
class WSSAssistantServer extends WSAssistant_1.WSAssistant {
    constructor(port) {
        super();
        this.clients = {};
        this.ID_KEY = "WSAssistantServerId";
        this.send = () => {
            throw new Error("send not supported in WSAssistantServer, use sendToAll instead");
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
            this._wss.on("connection", (ws, req) => callback(this.clients[this.getWSId(ws)], req.socket.remoteAddress));
        };
        this.onDisconnected = (callback) => {
            this._wss.on("close", () => callback());
        };
        this._wss = new ws_1.default.Server({ port });
        this._wss.on("connection", (ws, req) => {
            const id = req.headers["sec-websocket-key"];
            this.setWSId(ws, id);
            const client = new WSAssistantServer(ws);
            this.clients[id] = client;
            client.addEventListener("close", () => delete this.clients[id]);
        });
    }
    get wss() { return this._wss; }
    ;
    sendToAll(type, data) {
        this.forEachClient(client => client.send(type, data));
    }
    sendToAllExcept(type, skip, data) {
        const skipIds = skip.reduce((map, client) => {
            map[this.getWSId(client.ws)] = true;
            return map;
        }, {});
        this.forEachClient(client => {
            if (!skipIds[this.getWSId(client.ws)])
                client.send(type, data);
        });
    }
    forEachClient(callback) {
        Object.keys(this.clients).forEach(id => callback(this.clients[id], id));
    }
    setWSId(ws, id) {
        ws[this.ID_KEY] = id;
    }
    getWSId(ws) {
        return ws[this.ID_KEY];
    }
}
exports.WSSAssistantServer = WSSAssistantServer;
//# sourceMappingURL=WSAssistantServer.js.map