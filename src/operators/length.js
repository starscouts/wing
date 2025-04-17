WingAPI.createOperator("length", [
    {
        type: "variable"
    }
], (parameters) => {
    if (personalities[parameters[0]].includes("list")) {
        return lists[variables[parameters[0]]].length;
    } else {
        return variables[parameters[0]].length;
    }
})