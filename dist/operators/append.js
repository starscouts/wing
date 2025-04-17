WingAPI.createOperator("append", [
    {
        type: "variable"
    }
], (parameters, value, name, error) => {
    if (personalities[name].includes("list")) {
        lists[value].push(variables[parameters[0]]);
        return value;
    } else {
        error("Variable does not have the list personality");
    }
})