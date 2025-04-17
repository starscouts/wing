"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wing_1 = __importDefault(require("./Wing"));
const WingErrors_1 = __importDefault(require("./WingErrors"));
const WingInterpreter_1 = __importDefault(require("./WingInterpreter"));
class WingEvents extends Wing_1.default {
    static emit(func, parameters, index, globalLines, currentFunction, lines, file) {
        let interpret = WingInterpreter_1.default.interpret;
        let error = WingErrors_1.default.error;
        let crash = WingErrors_1.default.crash;
        let deprecation = WingErrors_1.default.deprecation;
        let execute = true;
        if (!Object.keys(events).includes(func)) {
            execute = false;
        }
        if (parameters && execute) {
            while (parameters.match(/\w*(?<!\\)\$([a-zA-Z0-9-_]+)/m)) {
                let vars = /\w*(?<!\\)\$([a-zA-Z0-9-_]+)/m.exec(parameters);
                let name = vars[1];
                if (!Object.keys(variables).includes(name)) {
                    error("Unresolved reference ($" + name + ")", index, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                    execute = false;
                    break;
                }
                parameters = parameters.replace(/\w*(?<!\\)\$([a-zA-Z0-9-_]+)/m, variables[name]);
            }
            parameters = parameters.replaceAll("\\$", "$");
        }
        if (execute) {
            if (typeof events[func] === "string") {
                let lines = events[func].split("\n");
                let initialIndex = parseInt(lines[1].substring(2));
                if (parameters && lines[0].startsWith("@@$")) {
                    let parameter = lines[0].substring(3);
                    variables[parameter] = parameters;
                    lines.shift();
                    lines.shift();
                    interpret(lines, initialIndex, func, file);
                }
                else if (lines[0].startsWith("@@$")) {
                    parameters = "";
                }
                else {
                    lines.shift();
                    lines.shift();
                    interpret(lines, initialIndex, func, file);
                }
            }
        }
    }
}
exports.default = WingEvents;
let events = global.events;
let variables = global.variables;
//# sourceMappingURL=WingEvents.js.map