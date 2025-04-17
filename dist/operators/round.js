WingAPI.createOperator("round", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.round(parseFloat(parameters[0]));
})