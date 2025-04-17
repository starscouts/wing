import Wing from "./Wing";

export default class WingAPI extends Wing {
    constructor() {
        super();

        return {
            createFunction: (name, parameter, runtime) => {
                global.functions[name] = {
                    parameter,
                    runtime
                }
            },
            createCondition: (name, parameters, runtime) => {
                global.conditions[name] = {
                    parameters,
                    runtime
                }
            },
            createOperator: (name, parameters, runtime) => {
                global.operators[name] = {
                    parameters,
                    runtime
                }
            }
        }
    }
}