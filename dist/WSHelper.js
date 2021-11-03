(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WSHelper = void 0;
    class WSHelper {
        constructor(ws) {
            this.ws = ws;
            this.send = this.send.bind(this);
            this.addMessageListener = this.addMessageListener.bind(this);
            this.removeMessageListener = this.removeMessageListener.bind(this);
            this.addEventListener = this.addEventListener.bind(this);
            this.removeEventListener = this.removeEventListener.bind(this);
        }
        send(type, data) {
            if (!this.ws)
                return;
            this.ws.send(JSON.stringify({ type, data }));
        }
        addMessageListener(type, listener) {
            this.addEventListener("message", e => {
                const message = JSON.parse(e.data);
                if (type === message.type)
                    listener(message.data);
            });
        }
        removeMessageListener(type, listener) {
            this.removeEventListener("message", e => {
                const message = JSON.parse(e.data);
                if (type === message.type)
                    listener(message.data);
            });
        }
        addEventListener(type, callback) {
            if (!this.ws)
                return;
            this.ws.addEventListener(type, callback);
        }
        removeEventListener(type, callback) {
            if (!this.ws)
                return;
            this.ws.removeEventListener(type, callback);
        }
    }
    exports.WSHelper = WSHelper;
});
//# sourceMappingURL=WSHelper.js.map