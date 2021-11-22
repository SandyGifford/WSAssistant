"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSAssistantClient = void 0;
const WSAssistant_1 = require("../shared/WSAssistant");
class WSAssistantClient extends WSAssistant_1.WSAssistant {
    constructor(url, retryMS = 1000) {
        super();
        this.url = url;
        this.retryMS = retryMS;
        this.ws = null;
        this.listeners = {};
        this.send = (type, data) => {
            if (!this.ws)
                return;
            this.ws.send(JSON.stringify({ type, data }));
        };
        this.open = async () => {
            if (this.ws) {
                // TODO: consider throwing an error here instead of all of this business
                const ws = this.ws;
                if (ws.readyState === ws.OPEN)
                    return Promise.resolve();
                else
                    return new Promise((resolve, reject) => {
                        const closeListener = () => reject("connection was closed before open completed");
                        const errorListener = e => reject(e);
                        const openListener = () => {
                            ws.removeEventListener("open", openListener);
                            ws.removeEventListener("close", closeListener);
                            ws.removeEventListener("error", errorListener);
                            resolve();
                        };
                        ws.addEventListener("open", openListener);
                        ws.addEventListener("close", closeListener);
                        ws.addEventListener("error", errorListener);
                    });
            }
            const ws = this.ws = new WebSocket(this.url);
            Object.keys(this.listeners).forEach(lType => {
                this.listeners[lType].forEach(listener => this.ws?.addEventListener(lType, listener));
            });
            ws.addEventListener("error", e => {
                setTimeout(() => {
                    this.open();
                }, this.retryMS);
            });
            return new Promise(resolve => {
                ws.addEventListener("open", () => resolve());
            });
        };
        this.close = async () => {
            if (!this.ws)
                return Promise.resolve();
            const ws = this.ws;
            this.ws = null;
            ws.close();
            return new Promise(resolve => {
                ws.addEventListener("close", () => resolve());
            });
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
    }
}
exports.WSAssistantClient = WSAssistantClient;
//# sourceMappingURL=WSAssistantClient.js.map