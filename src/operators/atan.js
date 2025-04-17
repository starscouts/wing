WingAPI.createOperator("atan", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.atan(parseFloat(parameters[0]));
})