const { mkdirSync } = require('node:fs');
const path = require("node:path");
const { createApp } = require("./app.js");
const { createSwipeModel } = require("./models/swipe.model.js");

const port = Number(process.env.PORT || 3000);
const dataDir = process.env.DATA_DIR || path.join(__dirname, "data");
mkdirSync(dataDir, { recursive: true });

const swipeFile = path.join(dataDir, "swipes.json");
const app = createApp(createSwipeModel(swipeFile), process.env.FRONTEND_ORIGIN);

app.listen(port, "0.0.0.0", () => {
    console.log(`Backend listening on port ${port}`);
});

