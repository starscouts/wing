WingAPI.createOperator("int", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.trunc(parseFloat(parameters[0]));
})