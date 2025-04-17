WingAPI.createOperator("cos", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.cos(parseFloat(parameters[0]));
})