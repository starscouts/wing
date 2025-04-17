WingAPI.createOperator("log", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.log(parseFloat(parameters[0]));
})