import Wing from "./Wing";
import path from "path";
import fs from "fs";
import WingErrors from "./WingErrors";
import WingConditions from "./WingConditions";
import WingOperators from "./WingOperators";
import WingPersonalities from "./WingPersonalities";
import {randomUUID} from "crypto";
import WingEvents from "./WingEvents";

export default class WingInterpreter extends Wing {
    public static interpret(lines: string[], globalLines: number|null|undefined, currentFunction: string|null|undefined, file: string) {
        let count = lines.length;
        lines = lines.map(i => i.trim());
        let stripped = count - lines.length;

        let index = 1;

        if (!globalLines) {
            globalLines = stripped + 1;
            index = globalLines;
        }

        for (let line of lines) {
            try {
                let currentContext = contexts[contexts.length - 1];

                line = !line.trim().startsWith("--") ? line.split("--")[0].trim() : line;
                if (_debug) console.log("--> " + index + "; " + globalLines);
                if (_debug) console.log("--> " + line);
                if (_debug) console.log("--> " + JSON.stringify(variables));
                if (_debug) console.log("-->", contexts);

                if (line.match(/^if (.+) do$/m)) {
                    if (currentContext && currentContext.type === "function") {
                        functions[currentContext.target] += line + "\n";
                        contexts.push(currentContext);
                        index++;
                        globalLines++;
                        if (_debug) console.log("-------------------");
                        continue;
                    } else if (currentContext && currentContext.type === "event") {
                        events[currentContext.target] += line + "\n";
                        contexts.push(currentContext);
                        index++; globalLines++;
                        if (_debug) console.log("-------------------");
                        continue;
                    } else {
                        let condition = /^if (.+) do$/m.exec(line)[1];

                        if (!evaluateCondition(condition, variables, functions, contexts, index, globalLines, currentFunction, lines, file)) {
                            contexts.push({
                                type: "unmatched",
                                target: null
                            });
                            index++; globalLines++;
                            if (_debug) console.log("-------------------");
                            continue;
                        } else {
                            contexts.push({
                                type: "condition",
                                target: null
                            });
                            index++; globalLines++;
                            if (_debug) console.log("-------------------");
                            continue;
                        }
                    }
                } else if (line === "else do") {
                    if (currentContext && currentContext.type === "function") {
                        functions[currentContext.target] += line + "\n";
                        index++;
                        globalLines++;
                        if (_debug) console.log("-------------------");
                        continue;
                    } else if (currentContext && currentContext.type === "event") {
                        events[currentContext.target] += line + "\n";
                        index++; globalLines++;
                        if (_debug) console.log("-------------------");
                        continue;
                    } else {
                        if (currentContext && currentContext.type === "condition") {
                            contexts.pop();
                            contexts.push({
                                type: "unmatched",
                                target: null
                            });
                            index++; globalLines++;
                            if (_debug) console.log("-------------------");
                            continue;
                        } else if ((currentContext && currentContext.type === "unmatched") || linter) {
                            contexts.pop();
                            contexts.push({
                                type: "condition",
                                target: null
                            });
                            index++; globalLines++;
                            if (_debug) console.log("-------------------");
                            continue;
                        } else {
                            error("Attempted to use 'else' while not in a condition context", index, globalLines, currentFunction, lines, file, "ERR_ELSE_NOTIF");
                        }
                    }
                }

                if (line === "end") {
                    let pop = true;

                    if (contexts.length > 0) {
                        if (currentContext && currentContext.type === "event") {
                            if (contexts.length > 1) events[currentContext.target] += line + "\n";
                        }

                        if (currentContext && currentContext.type === "function") {
                            if (contexts.length > 1) functions[currentContext.target] += line + "\n";
                        }

                        if (currentContext && currentContext.type === "foreach") {
                            if (contexts.length > 1) {
                                foreach[currentContext.target] += line + "\n";
                            } else {
                                contexts.pop();
                                pop = false;
                                let list = variables[currentContext.variable].split("");

                                if (lists[variables[currentContext.variable]]) {
                                    list = lists[variables[currentContext.variable]];
                                }

                                for (let index in list) {
                                    variables["_index"] = index.toString();
                                    if (!constants.includes("_index")) constants.push("_index");
                                    personalities["_index"] = WingPersonalities.get(index.toString());

                                    let item = list[index];

                                    variables["_item"] = item.toString();
                                    if (!constants.includes("_item")) constants.push("_item");
                                    personalities["_item"] = WingPersonalities.get(item.toString());

                                    let lines = foreach[currentContext.target].split("\n");
                                    let initialIndex = parseInt(lines[0].substring(2));
                                    lines.shift();
                                    interpret(lines, initialIndex, "_foreach:$" + currentContext.variable + ":" + index, file);
                                }

                                try {
                                    delete foreach[currentContext.target];
                                    constants.splice(constants.indexOf("_item"), 1);
                                    constants.splice(constants.indexOf("_index"), 1);
                                } catch (e) {}
                            }
                        }

                        if (pop) contexts.pop();
                    } else {
                        error("Attempted to leave primary context", index, globalLines, currentFunction, lines, file, "ERR_END_PRIMARY");
                    }

                    index++; globalLines++;
                    if (_debug) console.log("-------------------");
                    continue;
                }

                if (currentContext && currentContext.type === "function") {
                    functions[currentContext.target] += line + "\n";
                    index++; globalLines++;
                    if (_debug) console.log("-------------------");
                    continue;
                }

                if (currentContext && currentContext.type === "event") {
                    events[currentContext.target] += line + "\n";
                    index++; globalLines++;
                    if (_debug) console.log("-------------------");
                    continue;
                }

                if (currentContext && currentContext.type === "unmatched") {
                    index++; globalLines++;
                    if (_debug) console.log("-------------------");
                    continue;
                }

                if (currentContext && currentContext.type === "foreach") {
                    foreach[currentContext.target] += line + "\n";
                    index++; globalLines++;
                    if (_debug) console.log("-------------------");
                    continue;
                }

                if (line.trim() === "" || line.trim().startsWith("--") || line.trim().startsWith("#!")) {
                    index++;
                    globalLines++;
                    if (_debug) console.log("-------------------");
                    continue;
                } else if (line.match(/^\$([a-zA-Z0-9-_]+) *< *(.*)$/gm)) {
                    let name = /\$([a-zA-Z0-9-_]+) *< *(.*)/gm.exec(line)[1];
                    let operation = /\$([a-zA-Z0-9-_]+) *< *(.*)/gm.exec(line)[2];
                    if (constants.includes(name)) {
                        error("Attempted to run operation on constant " + name, index, globalLines, currentFunction, lines, file, "ERR_OPERATOR_CONST");
                    } else {
                        if (!Object.keys(variables).includes(name)) {
                            error("Unresolved reference ($" + name + ")", index, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                        } else {
                            evaluateOperation(name, operation, variables, functions, contexts, index, globalLines, currentFunction, lines, file);
                        }
                    }
                    personalities[name] = WingPersonalities.get(variables[name]);
                } else if (line.match(/^\$([a-zA-Z0-9-_]+)(!|) *= *(.*)$/gm)) {
                    let name = /\$([a-zA-Z0-9-_]+)(!|) *= *(.*)/gm.exec(line)[1];
                    let execute = true;

                    if (name.startsWith("_")) {
                        error("Variable names starting with an underscore are reserved", index, globalLines, currentFunction, lines, file, "ERR_VARIABLE_RESERVED");
                        execute = false;
                    }

                    if (constants.includes(name)) {
                        error("Attempted to reassign constant " + name, index, globalLines, currentFunction, lines, file, "ERR_CONST_ASSIGN");
                    } else {
                        if (line.match(/^\$([a-zA-Z0-9-_]+)! *= *(.*)$/gm)) constants.push(name);

                        let assignment = /\$([a-zA-Z0-9-_]+)(!|) *= *(.*)/gm.exec(line)[3];

                        while (assignment.match(/\w*(?<!\\)\$([a-zA-Z0-9-_]+)/m)) {
                            let vars = /\w*(?<!\\)\$([a-zA-Z0-9-_]+)/m.exec(assignment);
                            let name = vars[1];

                            if (!Object.keys(variables).includes(name)) {
                                error("Unresolved reference ($" + name + ")", index, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                                execute = false;
                                break;
                            }

                            assignment = assignment.replace(/\w*(?<!\\)\$([a-zA-Z0-9-_]+)/m, variables[name]);
                        }

                        if (execute) {
                            variables[name] = assignment;
                            personalities[name] = WingPersonalities.get(variables[name]);
                        }
                    }
                } else if (line.match(/^foreach( (\$([a-zA-Z0-9-_]+)))( +do|)$/m)) {
                    let match = /^foreach( (\$([a-zA-Z0-9-_]+)))( +do|)$/m.exec(line);
                    let name = match[3];

                    if (!Object.keys(variables).includes(name)) {
                        error("Unresolved reference ($" + name + ")", index, globalLines, currentFunction, lines, file, "ERR_VARIABLE_NOENT");
                    } else {
                        let id = randomUUID();

                        contexts.push({
                            type: "foreach",
                            variable: name,
                            target: id
                        });

                        foreach[id] = "@@" + index + "\n";
                    }
                } else if (line.match(/^function ([a-zA-Z0-9-_]+)( (\$([a-zA-Z0-9-_]+)))?( +do|)$/m)) {
                    let match = /^function ([a-zA-Z0-9-_]+)( (\$([a-zA-Z0-9-_]+))*)?( +do|)$/m.exec(line);
                    let name = match[1];
                    let execute = true;

                    if (name.startsWith("_")) {
                        error("Function names starting with an underscore are reserved", index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_RESERVED");
                        execute = false;
                    }

                    if (Object.keys(functions).includes(name)) {
                        error("Attempted to override existing function " + name, index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_OVERRIDE");
                        execute = false;
                    }

                    if (execute) {
                        let parameter = match[4];
                        contexts.push({
                            type: "function",
                            target: name
                        });

                        if (parameter) {
                            functions[name] = "@@$" + parameter + "\n@@" + index + "\n";
                        } else {
                            functions[name] = "@@\n@@" + index + "\n";
                        }
                    }
                } else if (line.match(/^on ([a-zA-Z0-9-_]+)( (\$([a-zA-Z0-9-_]+)))?( +do|)$/m)) {
                    let match = /^on ([a-zA-Z0-9-_]+)( (\$([a-zA-Z0-9-_]+))*)?( +do|)$/m.exec(line);
                    let name = match[1];
                    let execute = true;

                    if (name.startsWith("_")) {
                        error("Event names starting with an underscore are reserved", index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_RESERVED");
                        execute = false;
                    }

                    if (Object.keys(events).includes(name)) {
                        error("Attempted to override existing event " + name, index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_OVERRIDE");
                        execute = false;
                    }

                    if (execute) {
                        let parameter = match[4];
                        contexts.push({
                            type: "event",
                            target: name
                        });

                        if (parameter) {
                            events[name] = "@@$" + parameter + "\n@@" + index + "\n";
                        } else {
                            events[name] = "@@\n@@" + index + "\n";
                        }
                    }
                } else if (line.match(/^emit ([a-zA-Z0-9-_]+)( (.*)|)$/gm)) {
                    let func = /^emit ([a-zA-Z0-9-_]+)( (.*)|)$/gm.exec(line)[1];
                    let parameters = /^emit ([a-zA-Z0-9-_]+)( (.*)|)$/gm.exec(line)[3];

                    WingEvents.emit(func, parameters, index, globalLines, currentFunction, lines, file);
                } else if (line.match(/^([a-zA-Z0-9-_]+)( (.*)|)$/gm)) {
                    let execute = true;
                    let func = /^([a-zA-Z0-9-_]+)( (.*)|)$/gm.exec(line)[1];
                    let parameters = /^([a-zA-Z0-9-_]+)( (.*)|)$/gm.exec(line)[3];

                    if (!Object.keys(functions).includes(func)) {
                        error("Unresolved reference (function " + func + ")", index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_NOENT");
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
                        if (typeof functions[func] === "object") {
                            if (functions[func]["parameter"] && !parameters) {
                                error("Missing parameter for function " + func, index, globalLines, currentFunction, lines, file, "ERR_MISSING_FUNCTION_PARAM");
                                execute = false;
                            } else if (!functions[func]["parameter"] && parameters) {
                                error("Function " + func + " does not admit a parameter", index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_PARAM");
                                execute = false;
                            }

                            if (!linter && execute) {
                                functions[func]["runtime"](parameters, (message) => {
                                    error(message, index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_WARNING");
                                }, (message) => {
                                    crash(message, index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_ERROR");
                                }, (message) => {
                                    deprecation(message, index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_DEPRECATION");
                                }, variables, functions, contexts, index, globalLines, currentFunction, lines, file);
                            }
                        } else if (typeof functions[func] === "string") {
                            let lines = functions[func].split("\n");
                            let initialIndex = parseInt(lines[1].substring(2));

                            if (parameters && lines[0].startsWith("@@$")) {
                                let parameter = lines[0].substring(3);
                                variables[parameter] = parameters;

                                lines.shift();
                                lines.shift();
                                interpret(lines, initialIndex, func, file);
                            } else if (parameters) {
                                error("Function " + func + " does not admit a parameter", index, globalLines, currentFunction, lines, file, "ERR_FUNCTION_PARAM");
                            } else if (lines[0].startsWith("@@$")) {
                                error("Missing parameter for function " + func, index, globalLines, currentFunction, lines, file, "ERR_MISSING_FUNCTION_PARAM");
                            } else {
                                lines.shift();
                                lines.shift();
                                interpret(lines, initialIndex, func, file);
                            }
                        }
                    }
                } else if (line.startsWith("#include ") || line.startsWith("#require ")) {
                    let fatal = line.startsWith("#require ");
                    process.chdir(path.dirname(file));

                    if (currentFunction) {
                        if (fatal) {
                            crash("Attempted to require from a function context", index, globalLines, currentFunction, lines, file, "ERR_REQUIRE_FUNCTION");
                        } else {
                            error("Attempted to include from a function context", index, globalLines, currentFunction, lines, file, "ERR_INCLUDE_FUNCTION");
                        }

                        index++;
                        globalLines++;
                        continue;
                    }

                    let importFile = line.substring(9);

                    if (line.match(/^#(include|require) <([a-zA-Z0-9-_]+)>$/gm)) {
                        importFile = wingRoot + "/modules/" + /^#(include|require) <([a-zA-Z0-9-_]+)>$/gm.exec(line)[2] + ".wjs";
                    } else if (line.match(/^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm)) {
                        importFile = wingRoot + "/modules/" + /^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm.exec(line)[2] + ".wjs";
                    }

                    if (!fs.existsSync(importFile) && !line.match(/^#(include|require) <([a-zA-Z0-9-_]+)>$/gm) && !line.match(/^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm)) {
                        if (fatal) {
                            crash("Required file " + importFile + " not found", index, globalLines, currentFunction, lines, file, "ERR_REQUIRE_NOENT");
                        } else {
                            error("Included file " + importFile + " not found", index, globalLines, currentFunction, lines, file, "ERR_INCLUDE_NOENT");
                        }

                        index++; globalLines++; continue;
                    } else if (line.match(/^#(include|require) <([a-zA-Z0-9-_]+)>$/gm)) {
                        if (!Object.keys(modules).includes(/^#(include|require) <([a-zA-Z0-9-_]+)>$/gm.exec(line)[2])) {
                            if (fatal) {
                                crash("Required internal module " + /^#(include|require) <([a-zA-Z0-9-_]+)>$/gm.exec(line)[2] + " not found", index, globalLines, currentFunction, lines, file, "ERR_REQUIRE_NOENT");
                            } else {
                                error("Included internal module " + /^#(include|require) <([a-zA-Z0-9-_]+)>$/gm.exec(line)[2] + " not found", index, globalLines, currentFunction, lines, file, "ERR_INCLUDE_NOENT");
                            }
                        }
                    } else if (line.match(/^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm)) {
                        if (!Object.keys(modules).includes(/^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm.exec(line)[2])) {
                            if (fatal) {
                                crash("Required internal module " + /^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm.exec(line)[2] + " not found", index, globalLines, currentFunction, lines, file, "ERR_REQUIRE_NOENT");
                            } else {
                                error("Included internal module " + /^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm.exec(line)[2] + " not found", index, globalLines, currentFunction, lines, file, "ERR_INCLUDE_NOENT");
                            }
                        }
                    }

                    if (!line.match(/^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm) && !line.match(/^#(include|require) <([a-zA-Z0-9-_]+)>$/gm)) {
                        try {
                            let _text = fs.readFileSync(importFile).toString();
                        } catch (e) {
                            if (fatal) {
                                crash("Required file " + importFile + " is unreadable", index, globalLines, currentFunction, lines, file, "ERR_REQUIRE_READ");
                            } else {
                                error("Included file " + importFile + " is unreadable", index, globalLines, currentFunction, lines, file, "ERR_INCLUDE_READ");
                            }

                            index++;
                            globalLines++;
                            continue;
                        }
                    }

                    let ext = path.extname(importFile);

                    if (ext === ".wjs") {
                        if (!linter || line.match(/^#(include|require) <([a-zA-Z0-9-_]+)>$/gm) || line.match(/^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm)) {
                            if (line.match(/^#(include|require) <([a-zA-Z0-9-_]+)>$/gm) || line.match(/^#(include|require) wing:([a-zA-Z0-9-_]+)$/gm)) {
                                eval(modules[importFile]);
                            } else {
                                eval(fs.readFileSync(importFile).toString());
                            }
                        }
                    } else if (ext === ".wing") {
                        interpret(fs.readFileSync(importFile).toString().replaceAll("\r\n", "\n").split("\n"), undefined, null, importFile);
                    } else {
                        if (fatal) {
                            crash("Required file " + importFile + " is neither of Wing JS Binding file (.wjs) or Wing Source file (.wing)", index, globalLines, currentFunction, lines, file, "ERR_REQUIRE_INVALID");
                        } else {
                            error("Included file " + importFile + " is neither of Wing JS Binding file (.wjs) or Wing Source file (.wing)", index, globalLines, currentFunction, lines, file, "ERR_INCLUDE_INVALID");
                        }
                    }
                } else if (line === "#strict") {
                    global.strictMode = true;
                } else if (line.startsWith("?!")) {
                    deprecation(line.substring(2).trim(), index, globalLines, currentFunction, lines, file, "ERR_CUSTOM_DEPRECATION");
                } else if (line.startsWith("??")) {
                    crash(line.substring(2).trim(), index, globalLines, currentFunction, lines, file, "ERR_CUSTOM_ERROR");
                } else if (line.startsWith("?")) {
                    error(line.substring(1).trim(), index, globalLines, currentFunction, lines, file, "ERR_CUSTOM_WANING");
                } else {
                    error("Syntax error", index, globalLines, currentFunction, lines, file, "ERR_SYNTAX_GENERAL");
                }

                index++; globalLines++;
                if (_debug) console.log("-------------------");
            } catch (e) {
                if (_debug) console.error(e);
                crash("Internal system error: " + e.message, index, globalLines, currentFunction, lines, file, "ERR_INTERNAL");
                index++; globalLines++;
                if (_debug) console.log("-------------------");
            }
        }
    }
}

let _debug = global._debug;
let contexts = global.contexts;

let variables = global.variables;
let personalities = global.personalities;
let constants = global.constants;
let functions = global.functions;
let linter = global.linter.enabled;
let lists = global.lists;
let events = global.events;
let foreach = global.foreach;
let modules = global.modules;
let interpret = WingInterpreter.interpret;
let wingRoot = global.wingRoot;

let error = WingErrors.error;
let crash = WingErrors.crash;
let deprecation = WingErrors.deprecation;

let evaluateCondition = WingConditions.evaluate;
let evaluateOperation = WingOperators.evaluate;