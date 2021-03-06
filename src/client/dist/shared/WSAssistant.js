"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSAssistant = void 0;
class WSAssistant {
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
}
exports.WSAssistant = WSAssistant;
//# sourceMappingURL=WSAssistant.js.map