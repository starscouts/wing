WingAPI.createOperator("logdec", [
    {
        type: "variable"
    }
], (parameters) => {
    return Math.log10(parseFloat(parameters[0]));
})