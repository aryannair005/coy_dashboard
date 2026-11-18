const fs = require("node:fs");
const path = require("node:path");

function readSwipes(file) {
    try {
        const swipes = JSON.parse(fs.readFileSync(file, "utf8"));
        if (!Array.isArray(swipes)) {
            throw new Error("Invalid swipe file format.");
        }
        return swipes;
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}

function saveSwipes(file, swipes) {
    fs.mkdirSync(path.dirname(file), { recursive: true });

    // Write to a temporary file first so the original stays intact if the write fails.
    const tempFile = file + ".tmp";
    fs.writeFileSync(tempFile, JSON.stringify(swipes, null, 4));
    fs.renameSync(tempFile, file);
}

module.exports = { readSwipes, saveSwipes };

