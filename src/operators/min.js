WingAPI.createOperator("min", [
    {
        type: "variables"
    }
], (parameters) => {
    return Math.min(...parameters.map(i => parseFloat(variables[i])));
})