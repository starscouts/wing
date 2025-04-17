const { randomUUID } = require('crypto');

WingAPI.createOperator("list", [], () => {
    let name = "[List '" + randomUUID() + "']";
    lists[name] = [];
    return name;
})