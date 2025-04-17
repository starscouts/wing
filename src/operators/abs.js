WingAPI.createOperator("abs", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.abs(parseFloat(parameters[0]));
})