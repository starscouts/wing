WingAPI.createOperator("concat", [
    {
        type: "variables"
    }
], (parameters) => {
    return parameters.map(i => variables[i]).reduce((a, b) => { return a.concat(b); });
})