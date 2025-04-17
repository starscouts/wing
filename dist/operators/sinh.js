WingAPI.createOperator("sinh", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.sinh(parseFloat(parameters[0]));
})