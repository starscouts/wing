WingAPI.createCondition("defined", [
    {
        type: "variable"
    }
], (parameters) => {
    return Object.keys(variables).includes(parameters[0]);
})