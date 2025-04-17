import Wing from "./Wing";
import WingErrors from "./WingErrors";
import WingInterpreter from "./WingInterpreter";

export default class WingEvents extends Wing {
    public static emit(func: string, parameters: string|null|undefined, index: number, globalLines: number, currentFunction: string|null|undefined, lines: string[], file: string) {
        let interpret = WingInterpreter.interpret;
        let error = WingErrors.error;
        let crash = WingErrors.crash;
        let deprecation = WingErrors.deprecation;
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
                } else if (lines[0].startsWith("@@$")) {
                    parameters = "";
                } else {
                    lines.shift();
                    lines.shift();
                    interpret(lines, initialIndex, func, file);
                }
            }
        }
    }
}

let events = global.events;
let variables = global.variables;