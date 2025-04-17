WingAPI.createOperator("cbrt", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.cbrt(parseFloat(parameters[0]));
})