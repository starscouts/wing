const fs = require('fs');

function fix(text) {
    return "0".repeat(10 - text.length) + text;
}

let version = new Date(new Date().toISOString().split("T")[0]).getTime() / 1000 / 3600 + "-" + Math.round((new Date().getTime() - new Date(new Date().toISOString().split("T")[0]).getTime()) / 1000);

let today = new Date().toISOString().replaceAll("T", "-").replace("Z", "-").replaceAll(".", "-").replaceAll(":", "-").split("-").join("").substring(0, 8);
let build = fs.readFileSync("../.build").toString().trim().split(".");

if (build[2] !== today) {
    build[2] = today;
    build[1] = "0";
    build[0] = parseInt(build[0]) + 1;
} else {
    build[1] = parseInt(build[1]) + 1;
}

fs.writeFileSync("../.build", build.join("."));

fs.writeFileSync("index.ts", fs.readFileSync("index.ts").toString().replaceAll("%%V", version).replace(/^(global\.build = "%BUILD:)(.*)(%";)$/gm, "$1" + build[0] + "." + build[1] + "$3").replaceAll("%%D", (new Date().toLocaleDateString('en-uk',{weekday: 'short',year:'numeric',month:'short',day:'numeric'}).split(",").join("")) + " " + new Date().toLocaleTimeString('en-uk',{timeZoneName:'short'})));