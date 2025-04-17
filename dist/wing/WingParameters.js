"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wing_1 = __importDefault(require("./Wing"));
let params = process.argv.filter(i => i.startsWith("--")).map(i => i.substring(2));
process.argv = process.argv.filter(i => !i.startsWith("--"));
class WingParameters extends Wing_1.default {
    static get(parameter) {
        return params.includes(parameter);
    }
    static file() {
        if (process.argv[2]) {
            return process.argv[2];
        }
        else {
            return false;
        }
    }
}
exports.default = WingParameters;
//# sourceMappingURL=WingParameters.js.map