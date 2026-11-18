const fs = require("node:fs");
const path = require("node:path");

function readSwipes(file) {
    if (!fs.existsSync(file)) {
        return [];
    }

    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveSwipes(file, swipes) {
    fs.mkdirSync(path.dirname(file), { recursive: true });

    // Write to a temporary file first so the original stays intact if the write fails.
    const tempFile = file + ".tmp";
    fs.writeFileSync(tempFile, JSON.stringify(swipes, null, 4));
    fs.renameSync(tempFile, file);
}

module.exports = { readSwipes, saveSwipes };

