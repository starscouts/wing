WingAPI.createOperator("floor", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.floor(parseFloat(parameters[0]));
})