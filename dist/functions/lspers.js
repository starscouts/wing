WingAPI.createFunction("lspers", true, (parameter, error) => {
    if (!Object.keys(variables).includes(parameter)) {
        error("Invalid parameter");
        return;
    }

    console.log(personalities[parameter].join(", "))
})

