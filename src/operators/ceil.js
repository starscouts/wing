WingAPI.createOperator("ceil", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.ceil(parseFloat(parameters[0]));
})