import Wing from "./Wing";
import WingParameters from "./WingParameters";

export default class WingMetadata extends Wing {
    constructor() {
        if (WingParameters.get("version")) {
            console.log("Wing " + global.version + " \"" + global.codename + "\" (build " + global.build.replace(/^(%BUILD:)(.*)(%)$/gm, "$2") + "." + (global.debugBuild ? "debug" : "release") + "." + global.advancedBuild + "; " + global.buildDate + ")");
            process.exit();
        }

        if (WingParameters.get("version-creator")) {
            process.stdout.write(global.version);
            process.exit();
        }

        super();
    }
}