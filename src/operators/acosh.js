WingAPI.createOperator("acosh", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.acosh(parseFloat(parameters[0]));
})