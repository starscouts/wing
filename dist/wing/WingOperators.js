"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wing_1 = __importDefault(require("./Wing"));
const WingErrors_1 = __importDefault(require("./WingErrors"));
const WingInterpreter_1 = __importDefault(require("./WingInterpreter"));
const WingConditions_1 = __importDefault(require("./WingConditions"));
class WingOperators extends Wing_1.default {
    static evaluate(variable, operation, variables, functions, contexts, index, globalLines, currentFunction, lines, file) {
        let interpret = WingInterpreter_1.default.interpret;
        let error = WingErrors_1.default.error;
        let crash = WingErrors_1.default.crash;
        let deprecation = WingErrors_1.default.deprecation;
        let evaluateCondition = WingConditions_1.default.evaluate;
        let evaluateOperation = WingOperators.evaluate;
        let argv = operation.split(" ");
        let name = argv[0];
        argv.shift();
        let params = argv;
        let line = index;
        if (operators[name]) {
            for (let _index in operators[name]["parameters"]) {
                let index = parseInt(_index);
                let parameter = operators[name]["parameters"][index];
                let local = params[index];
                if (params[index]) {
                    switch (parameter.type) {
                        case "variable":
                            if (local.match(/^\$([a-zA-Z0-9-_]+)$/gm)) {
                                if (Object.keys(variables).includes(params[index].substring(1))) {
                                    params[index] = params[index].substring(1);
                                }
                                else {
                                    error("Unresolved reference ($" + params[index].substring(1) + ")", line, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                                    return false;
                                }
                            }
                            else {
                                error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_SYNTAX");
                                return false;
                            }
                            break;
                        case "variables":
                            let vars = params;
                            for (let i; i < index; i++) {
                                vars.shift();
                            }
                            for (let _i in vars) {
                                let i = parseInt(_i);
                                let v = vars[i];
                                if (v.match(/^\$([a-zA-Z0-9-_]+)$/gm)) {
                                    if (Object.keys(variables).includes(params[index + i].substring(1))) {
                                        params[index + i] = params[index + i].substring(1);
                                    }
                                    else {
                                        error("Unresolved reference ($" + params[index + i].substring(1) + ")", line, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                                        return false;
                                    }
                                }
                                else {
                                    error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_SYNTAX");
                                    return false;
                                }
                            }
                            break;
                        case "number":
                            if (!isNaN(parseFloat(local)) && isFinite(parseFloat(local))) {
                                // @ts-ignore
                                params[index] = parseFloat(local);
                            }
                            else {
                                error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_SYNTAX");
                                return false;
                            }
                            break;
                        case "values":
                            if (parameter.values.includes(local)) {
                                params[index] = local;
                            }
                            else {
                                error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_SYNTAX");
                                return false;
                            }
                            break;
                        default:
                            break;
                    }
                }
                else {
                    error("Missing parameter for operator " + name, line, globalLines, currentFunction, lines, file, "ERR_MISSING_OPERATOR_PARAM");
                    return false;
                }
            }
            if (!linter) {
                variables[variable] = operators[name]["runtime"](params, variables[variable], variable, (message) => {
                    error(message, index, globalLines, currentFunction, lines, file, "ERR_OPERATOR_WARNING");
                }, (message) => {
                    crash(message, index, globalLines, currentFunction, lines, file, "ERR_OPERATOR_ERROR");
                }, (message) => {
                    deprecation(message, index, globalLines, currentFunction, lines, file, "ERR_OPERATOR_DEPRECATION");
                });
                if (typeof variables[variable] !== "string") {
                    variables[variable] = String(variables[variable]);
                }
            }
            else {
                variables[variable] = "-";
            }
        }
        else {
            error("Unresolved reference (operator " + name + ")", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_NOENT");
            return false;
        }
    }
}
exports.default = WingOperators;
let _debug = global._debug;
let contexts = global.contexts;
let variables = global.variables;
let constants = global.constants;
let personalities = global.personalities;
let functions = global.functions;
let operators = global.operators;
let linter = global.linter.enabled;
let modules = global.modules;
let lists = global.lists;
let wingRoot = global.wingRoot;
//# sourceMappingURL=WingOperators.js.map