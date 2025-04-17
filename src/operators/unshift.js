WingAPI.createOperator("unshift", [
    {
        type: "variable"
    }
], (parameters, value, name, error) => {
    if (personalities[name].includes("list")) {
        lists[value].unshift(variables[parameters[0]]);
        return value;
    } else {
        error("Variable does not have the list personality");
    }
})