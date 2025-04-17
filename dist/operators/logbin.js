WingAPI.createOperator("logbin", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.log2(parseFloat(parameters[0]));
})