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
    exports.WSHelper = WSHelper;
});
//# sourceMappingURL=WSHelper.js.map