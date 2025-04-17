"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wing_1 = __importDefault(require("./Wing"));
class WingAPI extends Wing_1.default {
    constructor() {
        super();
        return {
            createFunction: (name, parameter, runtime) => {
                global.functions[name] = {
                    parameter,
                    runtime
                };
            },
            createCondition: (name, parameters, runtime) => {
                global.conditions[name] = {
                    parameters,
                    runtime
                };
            },
            createOperator: (name, parameters, runtime) => {
                global.operators[name] = {
                    parameters,
                    runtime
                };
            }
        };
    }
}
exports.default = WingAPI;
//# sourceMappingURL=WingAPI.js.map