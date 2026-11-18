const path = require("node:path");
const { createApp } = require("./app.js");
const { createSwipeModel } = require("./models/swipe.model.js");

const swipeFile = path.join(__dirname, "data", "swipes.json");
const app = createApp(createSwipeModel(swipeFile));

app.listen(3000, "127.0.0.1", () => {
    console.log("Backend running at http://127.0.0.1:3000");
});

