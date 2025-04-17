WingAPI.createOperator("round", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.fround(parseFloat(parameters[0]));
})