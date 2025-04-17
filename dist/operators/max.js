WingAPI.createOperator("max", [
    {
        type: "variables"
    }
], (parameters) => {
    return Math.max(...parameters.map(i => parseFloat(variables[i])));
})