import Wing from "./Wing";
import WingErrors from "./WingErrors";
import WingInterpreter from "./WingInterpreter";
import WingConditions from "./WingConditions";

export default class WingOperators extends Wing {
    public static evaluate(variable: string, operation: string, variables: any[], functions: any[], contexts: object[], index: number, globalLines: number, currentFunction: string|null|undefined, lines: string[], file: string) {
        let interpret = WingInterpreter.interpret;
        let error = WingErrors.error;
        let crash = WingErrors.crash;
        let deprecation = WingErrors.deprecation;
        let evaluateCondition = WingConditions.evaluate;
        let evaluateOperation = WingOperators.evaluate;

        let argv = operation.split(" ");
        let name = argv[0];
        argv.shift(); let params = argv;

        let line = index;

        if (operators[name]) {
            for (let _index in operators[name]["parameters"]) {
                let index: number = parseInt(_index);
                let parameter = operators[name]["parameters"][index];
                let local = params[index];

                if (params[index]) {
                    switch (parameter.type) {
                        case "variable":
                            if (local.match(/^\$([a-zA-Z0-9-_]+)$/gm)) {
                                if (Object.keys(variables).includes(params[index].substring(1))) {
                                    params[index] = params[index].substring(1);
                                } else {
                                    error("Unresolved reference ($" + params[index].substring(1) + ")", line, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                                    return false;
                                }
                            } else {
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
                                let i: number = parseInt(_i);
                                let v = vars[i];

                                if (v.match(/^\$([a-zA-Z0-9-_]+)$/gm)) {
                                    if (Object.keys(variables).includes(params[index + i].substring(1))) {
                                        params[index + i] = params[index + i].substring(1);
                                    } else {
                                        error("Unresolved reference ($" + params[index + i].substring(1) + ")", line, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                                        return false;
                                    }
                                } else {
                                    error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_SYNTAX");
                                    return false;
                                }
                            }

                            break;

                        case "number":
                            if (!isNaN(parseFloat(local)) && isFinite(parseFloat(local))) {
                                // @ts-ignore
                                params[index] = parseFloat(local);
                            } else {
                                error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_SYNTAX");
                                return false;
                            }

                            break;

                        case "values":
                            if (parameter.values.includes(local)) {
                                params[index] = local;
                            } else {
                                error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_SYNTAX");
                                return false;
                            }

                            break;

                        default:
                            break;
                    }
                } else {
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
            } else {
                variables[variable] = "-";
            }
        } else {
            error("Unresolved reference (operator " + name + ")", line, globalLines, currentFunction, lines, file, "ERR_OPERATOR_NOENT");
            return false;
        }
    }
}

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