const express = require("express");
const discoverRouter = require("./routes/discover.routes.js");

function createApp(swipes) {
    const app = express();
    app.locals.swipes = swipes;

    app.use(express.json());
    app.use((req, res, next) => {
        res.set("Cache-Control", "no-store");
        next();
    });
    app.use(discoverRouter);

    app.use((error, req, res, next) => {
        if (res.headersSent) {
            return next(error);
        }

        if (error.type === "entity.parse.failed") {
            return res.status(400).json({ message: "Send a valid JSON body." });
        }

        console.error(error);
        return res.status(500).json({ message: "Something went wrong. Try again." });
    });

    return app;
}

module.exports = { createApp };

