import Wing from "./Wing";

let params = process.argv.filter(i => i.startsWith("--")).map(i => i.substring(2));
process.argv = process.argv.filter(i => !i.startsWith("--"));

export default class WingParameters extends Wing {
    static get(parameter: string): boolean {
        return params.includes(parameter);
    }

    static file(): string|false {
        if (process.argv[2]) {
            return process.argv[2];
        } else {
            return false;
        }
    }
}