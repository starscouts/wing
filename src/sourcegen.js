const fs = require('fs');

let sources = "";

for (let file of fs.readdirSync("./functions")) {
    sources += 'require("./functions/' + file + '");\n';
}

for (let file of fs.readdirSync("./conditions")) {
    sources += 'require("./conditions/' + file + '");\n';
}

for (let file of fs.readdirSync("./operators")) {
    sources += 'require("./operators/' + file + '");\n';
}

for (let file of fs.readdirSync("./modules")) {
    sources += 'modules["' + file.split(".")[0] + '"] = Buffer.from("' + fs.readFileSync("./modules/" + file).toString("base64") + '", "base64").toString();\n';
}

fs.writeFileSync("sources.js", sources);