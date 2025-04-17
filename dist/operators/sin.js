WingAPI.createOperator("sin", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.sin(parseFloat(parameters[0]));
})