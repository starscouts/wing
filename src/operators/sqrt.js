WingAPI.createOperator("sqrt", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.sqrt(parseFloat(parameters[0]));
})