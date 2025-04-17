WingAPI.createOperator("acos", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.acos(parseFloat(parameters[0]));
})