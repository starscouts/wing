"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wing_1 = __importDefault(require("./Wing"));
const WingParameters_1 = __importDefault(require("./WingParameters"));
class WingLinter extends Wing_1.default {
    constructor() {
        super();
        this.enabled = false;
        if (!WingParameters_1.default.get("lint")) {
            return;
        }
        this.enabled = true;
        this.output = {
            problems: [],
            variables: [],
            constants: [],
            functions: [],
            operations: [],
            conditions: [],
            personalities: {}
        };
    }
    display() {
        if (!this.enabled)
            return;
        this.output["variables"] = Object.keys(global.variables).filter(i => !global.constants.includes(i));
        this.output["constants"] = global.constants;
        this.output["functions"] = Object.keys(global.functions);
        this.output["operations"] = Object.keys(global.operators);
        this.output["conditions"] = Object.keys(global.conditions);
        this.output["personalities"] = Object.keys(global.personalities);
        process.stdout.write(JSON.stringify(this.output));
    }
}
exports.default = WingLinter;
//# sourceMappingURL=WingLinter.js.map