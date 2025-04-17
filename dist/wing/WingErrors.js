"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wing_1 = __importDefault(require("./Wing"));
const chalk_1 = __importDefault(require("chalk"));
const WingEvents_1 = __importDefault(require("./WingEvents"));
class WingErrors extends Wing_1.default {
    static error(text, line, globalLine, currentFunction, lines, filename, code) {
        if (global.strictMode) {
            WingErrors.crash(text, line, globalLine, currentFunction, lines, filename, code);
        }
        else {
            if (Object.keys(events).includes("warning")) {
                WingEvents_1.default.emit("warning", text, line, globalLine, currentFunction, lines, filename);
            }
            else {
                WingErrors.message("yellow", true, text, line, globalLine, currentFunction, lines, filename, code);
            }
        }
    }
    static crash(text, line, globalLine, currentFunction, lines, filename, code) {
        if (Object.keys(events).includes("error")) {
            WingEvents_1.default.emit("error", text, line, globalLine, currentFunction, lines, filename);
        }
        else {
            WingErrors.message("red", true, text, line, globalLine, currentFunction, lines, filename, code);
        }
        if (!global.linter.enabled)
            process.exit(2);
    }
    static deprecation(text, line, globalLine, currentFunction, lines, filename, code) {
        if (Object.keys(events).includes("deprecation")) {
            WingEvents_1.default.emit("deprecation", text, line, globalLine, currentFunction, lines, filename);
        }
        else {
            WingErrors.message("cyan", false, text, line, globalLine, currentFunction, lines, filename, code);
        }
    }
    static message(color, showTrace, text, line, globalLine, currentFunction, lines, filename, code) {
        if (global.linter.enabled) {
            let type = "unknown";
            switch (color) {
                case "red":
                    type = "error";
                    break;
                case "yellow":
                    type = "warning";
                    break;
                case "cyan":
                    type = "deprecation";
                    break;
            }
            let actualLine = 1;
            if (line === globalLine) {
                actualLine = line;
            }
            else {
                actualLine = globalLine + 1;
            }
            let source = {
                uri: "_self",
                name: "_main",
                line: actualLine
            };
            if (currentFunction) {
                source.name = currentFunction;
            }
            global.linter.output.problems.push({
                type,
                message: text,
                code,
                line: actualLine,
                source
            });
        }
        else {
            if (showTrace)
                console.log(chalk_1.default.gray("------------------------------------------------------------------------"));
            let type = chalk_1.default.white.bgWhiteBright.inverse("Message:");
            switch (color) {
                case "red":
                    type = chalk_1.default.redBright.bgWhiteBright.inverse("Error:");
                    break;
                case "yellow":
                    type = chalk_1.default.yellowBright.bgWhiteBright.inverse("Warning:");
                    break;
                case "cyan":
                    type = chalk_1.default.cyanBright.bgWhiteBright.inverse("Deprecation:");
                    break;
            }
            if (line === globalLine) {
                if (showTrace) {
                    console.error(chalk_1.default.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk_1.default[color]("[" + code + "] " + text + "\n      * at line " + chalk_1.default.magenta(line) + "\n      * in file " + chalk_1.default.magenta(filename)));
                }
                else {
                    console.error(chalk_1.default.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk_1.default[color]("[" + code + "] " + text + " (line " + chalk_1.default.magenta(line) + " in " + chalk_1.default.magenta(filename) + ")"));
                }
            }
            else {
                if (currentFunction) {
                    if (showTrace) {
                        console.error(chalk_1.default.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk_1.default[color]("[" + code + "] " + text + "\n      * at local line " + chalk_1.default.magenta(line) + ", global line " + chalk_1.default.magenta(globalLine + 1) + "\n      * in function " + chalk_1.default.magenta(currentFunction) + "\n      * in file " + chalk_1.default.magenta(filename)));
                    }
                    else {
                        console.error(chalk_1.default.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk_1.default[color]("[" + code + "] " + text + " (line " + chalk_1.default.magenta(globalLine + 1) + " in " + chalk_1.default.magenta(filename) + ")"));
                    }
                }
                else {
                    if (showTrace) {
                        console.error(chalk_1.default.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk_1.default[color]("[" + code + "] " + text + "\n      * at local line " + chalk_1.default.magenta(line) + ", global line " + chalk_1.default.magenta(globalLine + 1) + "\n      * in file " + chalk_1.default.magenta(filename)));
                    }
                    else {
                        console.error(chalk_1.default.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk_1.default[color]("[" + code + "] " + text + " (line " + chalk_1.default.magenta(globalLine + 1) + " in " + chalk_1.default.magenta(filename) + ")"));
                    }
                }
                if (currentFunction) {
                    globalLine++;
                }
            }
            if (showTrace) {
                let lns = Math.max((globalLine - 1).toString().length, globalLine.toString().length, (globalLine + 1).toString().length);
                console.log("");
                if (lines[line - 2] || typeof lines[line - 2] === "string") {
                    let lnp = " ".repeat(lns - (globalLine - 1).toString().length) + (globalLine - 1).toString();
                    console.log("  " + chalk_1.default.gray(lnp + "  ") + chalk_1.default.gray(lines[line - 2]));
                }
                console.log(chalk_1.default.blueBright.bold(">") + " " + chalk_1.default.gray(globalLine + "  ") + lines[line - 1]);
                if (lines[line] || typeof lines[line] === "string") {
                    let lnn = " ".repeat(lns - (globalLine + 1).toString().length) + (globalLine + 1).toString();
                    console.log("  " + chalk_1.default.gray(lnn + "  ") + chalk_1.default.gray(lines[line]));
                }
                console.log(chalk_1.default.gray("------------------------------------------------------------------------"));
            }
        }
    }
}
exports.default = WingErrors;
let events = global.events;
//# sourceMappingURL=WingErrors.js.map