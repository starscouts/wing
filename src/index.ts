import WingLinter from "./wing/WingLinter";
import WingMetadata from "./wing/WingMetadata";
import WingParameters from "./wing/WingParameters";
import WingFileLoader from "./wing/WingFileLoader";
import WingAPI from "./wing/WingAPI";

global.version = "next";
global.codename = "Winter Wishday";

global.advancedBuild = "%%V";
global.build = "%BUILD:dev%";
global.debugBuild = true;
global.buildDate = "%%D";
global.wingRoot = __dirname;
global._debug = WingParameters.get("debug") && global.debugBuild;

global.variables = {};
global.functions = {};
global.personalities = {};
global.conditions = {};
global.operators = {};
global.constants = [];
global.modules = {};
global.lists = {};
global.events = {};
global.foreach = {};

global.strictMode = false;
global.WingAPI = new WingAPI();

global.linter = new WingLinter();
new WingMetadata();

let fileData = new WingFileLoader();
let filename = fileData.name;
let file = fileData.contents;

require("./sources.js");

let lines = file.replaceAll("\r\n", "\n").split("\n");
global.contexts = [];

import WingInterpreter from "./wing/WingInterpreter";
WingInterpreter.interpret(lines, undefined, null, filename);

global.linter.display();