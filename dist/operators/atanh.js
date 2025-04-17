WingAPI.createOperator("atanh", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.atanh(parseFloat(parameters[0]));
})