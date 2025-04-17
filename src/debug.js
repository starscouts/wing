const fs = require('fs');

fs.writeFileSync("index.ts", fs.readFileSync("index.ts").toString().replaceAll("global.debugBuild = true;", "global.debugBuild = true;").replaceAll("global.debugBuild = false;", "global.debugBuild = true;"));