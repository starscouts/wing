WingAPI.createOperator("pop", [], (parameters, value, name, error) => {
    if (personalities[name].includes("list")) {
        lists[value].pop();
        return value;
    } else {
        error("Variable does not have the list personality");
    }
})