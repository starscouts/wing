WingAPI.createOperator("subtract", [
    {
        type: "variables"
    }
], (parameters) => {
    return parameters.map(i => parseFloat(variables[i])).reduce((a, b) => { return a - b; });
})