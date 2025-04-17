const { randomUUID } = require('crypto');

WingAPI.createOperator("listcopy", [
    {
        type: "variable"
    }
], (parameters, value, error) => {
    let name = "[List '" + randomUUID() + "']";

    if (personalities[parameters[0]].includes("list")) {
        lists[name] = lists[variables[parameters[0]]];
        return name;
    } else {
        error("Variable does not have the list personality");
    }
})