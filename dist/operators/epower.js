WingAPI.createOperator("epower", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.exp(parseFloat(parameters[0]));
})