WingAPI.createOperator("shift", [], (parameters, value, name, error) => {
    if (personalities[name].includes("list")) {
        lists[value].shift();
        return value;
    } else {
        error("Variable does not have the list personality");
    }
})