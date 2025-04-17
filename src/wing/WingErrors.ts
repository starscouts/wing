import Wing from "./Wing";
import chalk from "chalk";
import WingEvents from "./WingEvents";

export default class WingErrors extends Wing {
    public static error(text, line, globalLine, currentFunction, lines, filename, code) {
        if (global.strictMode) {
            WingErrors.crash(text, line, globalLine, currentFunction, lines, filename, code);
        } else {
            if (Object.keys(events).includes("warning")) {
                WingEvents.emit("warning", text, line, globalLine, currentFunction, lines, filename);
            } else {
                WingErrors.message("yellow", true, text, line, globalLine, currentFunction, lines, filename, code);
            }
        }
    }

    public static crash(text, line, globalLine, currentFunction, lines, filename, code) {
        if (Object.keys(events).includes("error")) {
            WingEvents.emit("error", text, line, globalLine, currentFunction, lines, filename);
        } else {
            WingErrors.message("red", true, text, line, globalLine, currentFunction, lines, filename, code);
        }

        if (!global.linter.enabled) process.exit(2);
    }

    public static deprecation(text, line, globalLine, currentFunction, lines, filename, code) {
        if (Object.keys(events).includes("deprecation")) {
            WingEvents.emit("deprecation", text, line, globalLine, currentFunction, lines, filename);
        } else {
            WingErrors.message("cyan", false, text, line, globalLine, currentFunction, lines, filename, code);
        }
    }

    private static message(color, showTrace, text, line, globalLine, currentFunction, lines, filename, code) {
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
            } else {
                actualLine = globalLine + 1;
            }

            let source = {
                uri: "_self",
                name: "_main",
                line: actualLine
            }

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
        } else {
            if (showTrace) console.log(chalk.gray("------------------------------------------------------------------------"));

            let type = chalk.white.bgWhiteBright.inverse("Message:");

            switch (color) {
                case "red":
                    type = chalk.redBright.bgWhiteBright.inverse("Error:");
                    break;

                case "yellow":
                    type = chalk.yellowBright.bgWhiteBright.inverse("Warning:");
                    break;

                case "cyan":
                    type = chalk.cyanBright.bgWhiteBright.inverse("Deprecation:");
                    break;
            }

            if (line === globalLine) {
                if (showTrace) {
                    console.error(chalk.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk[color]("[" + code + "] " + text + "\n      * at line " + chalk.magenta(line) + "\n      * in file " + chalk.magenta(filename)));
                } else {
                    console.error(chalk.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk[color]("[" + code + "] " + text + " (line " + chalk.magenta(line) + " in " + chalk.magenta(filename) + ")"));
                }
            } else {
                if (currentFunction) {
                    if (showTrace) {
                        console.error(chalk.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk[color]("[" + code + "] " + text + "\n      * at local line " + chalk.magenta(line) + ", global line " + chalk.magenta(globalLine + 1) + "\n      * in function " + chalk.magenta(currentFunction) + "\n      * in file " + chalk.magenta(filename)));
                    } else {
                        console.error(chalk.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk[color]("[" + code + "] " + text + " (line " + chalk.magenta(globalLine + 1) + " in " + chalk.magenta(filename) + ")"));
                    }
                } else {
                    if (showTrace) {
                        console.error(chalk.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk[color]("[" + code + "] " + text + "\n      * at local line " + chalk.magenta(line) + ", global line " + chalk.magenta(globalLine + 1) + "\n      * in file " + chalk.magenta(filename)));
                    } else {
                        console.error(chalk.blueBright.bgWhiteBright.inverse("Wing:") + " " + type + " " + chalk[color]("[" + code + "] " + text + " (line " + chalk.magenta(globalLine + 1) + " in " + chalk.magenta(filename) + ")"));
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
                    console.log("  " + chalk.gray(lnp + "  ") + chalk.gray(lines[line - 2]));
                }

                console.log(chalk.blueBright.bold(">") + " " + chalk.gray(globalLine + "  ") + lines[line - 1]);

                if (lines[line] || typeof lines[line] === "string") {
                    let lnn = " ".repeat(lns - (globalLine + 1).toString().length) + (globalLine + 1).toString();
                    console.log("  " + chalk.gray(lnn + "  ") + chalk.gray(lines[line]));
                }

                console.log(chalk.gray("------------------------------------------------------------------------"));
            }
        }
    }
}

let events = global.events;