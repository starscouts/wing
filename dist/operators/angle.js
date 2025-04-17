WingAPI.createOperator("angle", [
    {
        type: "variable"
    },
    {
        type: "variable"
    }
], (parameters) => {
    return Math.atan2(parseFloat(parameters[0]), parseFloat(parameters[1]));
})