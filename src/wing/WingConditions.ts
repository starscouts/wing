import Wing from "./Wing";
import WingErrors from "./WingErrors";
import WingInterpreter from "./WingInterpreter";
import WingOperators from "./WingOperators";

export default class WingConditions extends Wing {
    public static evaluate(condition: string, variables: any[], functions: any[], contexts: object[], index: number, globalLines: number, currentFunction: string|null|undefined, lines: string[], file: string) {
        let interpret = WingInterpreter.interpret;
        let error = WingErrors.error;
        let crash = WingErrors.crash;
        let deprecation = WingErrors.deprecation;
        let evaluateCondition = WingConditions.evaluate;
        let evaluateOperation = WingOperators.evaluate;

        let argv = condition.split(" ");
        let name = argv[0];
        argv.shift(); let params = argv;

        let line = index;

        if (conditions[name]) {
            for (let index in conditions[name]["parameters"]) {
                let parameter = conditions[name]["parameters"][index];
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
                                error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_CONDITION_SYNTAX");
                                return false;
                            }

                            break;

                        case "variables":
                            let vars = params;

                            for (let i; i < index; i++) {
                                vars.shift();
                            }

                            for (let i in vars) {
                                let v = vars[i];

                                if (v.match(/^\$([a-zA-Z0-9-_]+)$/gm)) {
                                    if (Object.keys(variables).includes(params[index + i].substring(1))) {
                                        params[index + i] = params[index + i].substring(1);
                                    } else {
                                        error("Unresolved reference ($" + params[index + i].substring(1) + ")", line, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                                        return false;
                                    }
                                } else {
                                    error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_CONDITION_SYNTAX");
                                    return false;
                                }
                            }

                            break;

                        case "number":
                            if (!isNaN(parseFloat(local)) && isFinite(local)) {
                                params[index] = parseFloat(local);
                            } else {
                                error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_CONDITION_SYNTAX");
                                return false;
                            }

                            break;

                        case "values":
                            if (parameter.values.includes(local)) {
                                params[index] = local;
                            } else {
                                error("Syntax error", line, globalLines, currentFunction, lines, file, "ERR_CONDITION_SYNTAX");
                                return false;
                            }

                            break;

                        default:
                            throw new Error("Invalid condition parameter type");
                    }
                } else {
                    error("Missing parameter for condition " + name, line, globalLines, currentFunction, lines, file, "ERR_MISSING_CONDITION_PARAM");
                    return false;
                }
            }

            if (linter) {
                return true;
            } else {
                return conditions[name]["runtime"](params, (message) => {
                    error(message, index, globalLines, currentFunction, lines, file, "ERR_CONDITION_WARNING");
                }, (message) => {
                    crash(message, index, globalLines, currentFunction, lines, file, "ERR_CONDITION_ERROR");
                }, (message) => {
                    deprecation(message, index, globalLines, currentFunction, lines, file, "ERR_CONDITION_DEPRECATION");
                });
            }
        } else {
            error("Unresolved reference (condition " + name + ")", line, globalLines, currentFunction, lines, file, "ERR_CONDITION_NOENT");
            return false;
        }
    }
}

let _debug = global._debug;
let contexts = global.contexts;

let variables = global.variables;
let constants = global.constants;
let functions = global.functions;
let lists = global.lists;
let personalities = global.personalities;
let conditions = global.conditions;
let linter = global.linter.enabled;
let modules = global.modules;
let wingRoot = global.wingRoot;