WingAPI.createOperator("tanh", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.tanh(parseFloat(parameters[0]));
})