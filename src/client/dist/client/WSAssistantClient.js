"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSAssistantClient = void 0;
const WSAssistant_1 = require("../shared/WSAssistant");
class WSAssistantClient extends WSAssistant_1.WSAssistant {
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
                this.listeners[lType].forEach(listener => this.ws?.addEventListener(lType, listener));
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
        this.addEventListener = (type, listener) => {
            if (!this.listeners[type])
                this.listeners[type] = [];
            const listeners = this.listeners[type];
            if (listeners.indexOf(listener) === -1)
                listeners.push(listener);
            this.ws?.addEventListener(type, listener);
        };
        this.removeEventListener = (type, listener) => {
            if (!this.listeners[type])
                this.listeners[type] = [];
            const listeners = this.listeners[type];
            const index = listeners.indexOf(listener);
            if (index !== -1)
                listeners.splice(index, 1);
            this.ws?.removeEventListener(type, listener);
        };
        this.ws = new WebSocket(url);
    }
}
exports.WSAssistantClient = WSAssistantClient;
//# sourceMappingURL=WSAssistantClient.js.map