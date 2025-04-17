"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wing_1 = __importDefault(require("./Wing"));
const WingParameters_1 = __importDefault(require("./WingParameters"));
class WingMetadata extends Wing_1.default {
    constructor() {
        if (WingParameters_1.default.get("version")) {
            console.log("Wing " + global.version + " \"" + global.codename + "\" (build " + global.build.replace(/^(%BUILD:)(.*)(%)$/gm, "$2") + "." + (global.debugBuild ? "debug" : "release") + "." + global.advancedBuild + "; " + global.buildDate + ")");
            process.exit();
        }
        if (WingParameters_1.default.get("version-creator")) {
            process.stdout.write(global.version);
            process.exit();
        }
        super();
    }
}
exports.default = WingMetadata;
//# sourceMappingURL=WingMetadata.js.map