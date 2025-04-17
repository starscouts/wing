import Wing from "./Wing";
import WingParameters from "./WingParameters";
import fs, {existsSync} from "fs";
import {resolve} from "path";

export default class WingFileLoader extends Wing {
    public name: string;
    public contents: string;

    constructor() {
        super();

        if (WingParameters.get("base64")) {
            if (!WingParameters.file()) {
                console.error("No code specified");
                return;
            } else {
                this.name = "_embedded";
                this.contents = Buffer.from(WingParameters.file() as string, "base64").toString();
            }
        } else {
            if (!WingParameters.file()) {
                console.error("Missing operand");
                process.exit(2);
            }

            if (!existsSync(WingParameters.file() as string)) {
                console.error(WingParameters.file() + ": no such file or directory");
                process.exit(2);
            }

            this.name = resolve(WingParameters.file() as string);

            try {
                this.contents = fs.readFileSync(WingParameters.file() as string).toString();
            } catch (e) {
                console.error(WingParameters.file() + ": read error: " + e.message);
                process.exit(2);
            }
        }
    }

}