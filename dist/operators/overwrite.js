WingAPI.createOperator("overwrite", [
    {
        type: "number"
    },
    {
        type: "variable"
    }
], (parameters, value, name, error) => {
    if (personalities[name].includes("list")) {
        if (lists[value][parameters[0]]) {
            lists[value][parameters[0]] = variables[parameters[1]];
            return value;
        } else {
            error("List index " + parameters[0] + " is out of range");
        }
    } else {
        error("Variable does not have the list personality");
    }
})