WingAPI.createOperator("tan", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.tan(parseFloat(parameters[0]));
})