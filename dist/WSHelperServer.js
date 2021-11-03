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
    exports.WSHelperServer = void 0;
    const WSHelper_1 = require("./WSHelper");
    class WSHelperServer extends WSHelper_1.WSHelper {
    }
    exports.WSHelperServer = WSHelperServer;
});
//# sourceMappingURL=WSHelperServer.js.map