import Wing from "./Wing";
import WingParameters from "./WingParameters";

export default class WingLinter extends Wing {
    public output: object;
    public enabled: boolean = false;

    constructor() {
        super();

        if (!WingParameters.get("lint")) {
            return;
        }

        this.enabled = true;

        this.output = {
            problems: [],
            variables: [],
            constants: [],
            functions: [],
            operations: [],
            conditions: [],
            personalities: {}
        }
    }

    public display() {
        if (!this.enabled) return;

        this.output["variables"] = Object.keys(global.variables).filter(i => !global.constants.includes(i));
        this.output["constants"] = global.constants;
        this.output["functions"] = Object.keys(global.functions);
        this.output["operations"] = Object.keys(global.operators);
        this.output["conditions"] = Object.keys(global.conditions);
        this.output["personalities"] = Object.keys(global.personalities);

        process.stdout.write(JSON.stringify(this.output));
    }
}