(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./WSHelperClient", "./WSHelperServer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WSSHelperServer = exports.WSHelperServer = exports.WSHelperClient = void 0;
    var WSHelperClient_1 = require("./WSHelperClient");
    Object.defineProperty(exports, "WSHelperClient", { enumerable: true, get: function () { return WSHelperClient_1.WSHelperClient; } });
    var WSHelperServer_1 = require("./WSHelperServer");
    Object.defineProperty(exports, "WSHelperServer", { enumerable: true, get: function () { return WSHelperServer_1.WSHelperServer; } });
    Object.defineProperty(exports, "WSSHelperServer", { enumerable: true, get: function () { return WSHelperServer_1.WSSHelperServer; } });
});
//# sourceMappingURL=index.js.map