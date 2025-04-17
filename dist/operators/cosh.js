WingAPI.createOperator("cosh", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.cosh(parseFloat(parameters[0]));
})