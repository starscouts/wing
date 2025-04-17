WingAPI.createOperator("item", [
    {
        type: "variable"
    },
    {
        type: "number"
    }
], (parameters, value, error) => {
    if (personalities[parameters[0]].includes("list")) {
        if (lists[variables[parameters[0]]][parseInt(parameters[1])]) {
            return lists[variables[parameters[0]]][parseInt(parameters[1])];
        } else {
            error("List index out of range");
        }
    } else {
        let list = variables[parameters[0]].split("");
        if (list[parseInt(parameters[1])]) {
            return list[parseInt(parameters[1])];
        } else {
            error("List index out of range");
        }
    }
})