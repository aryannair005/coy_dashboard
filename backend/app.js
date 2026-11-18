const express = require("express");
const discoverRouter = require("./routes/discover.routes.js");

function createApp(swipes, frontendOrigin) {
    const app = express();
    app.locals.swipes = swipes;

    if (frontendOrigin) {
        app.use((req, res, next) => {
            res.vary("Origin");
            if (req.get("Origin") === frontendOrigin) {
                res.set("Access-Control-Allow-Origin", frontendOrigin);
                if (req.method === "OPTIONS") {
                    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                    res.set("Access-Control-Allow-Headers", "Content-Type");
                    return res.sendStatus(204);
                }
            }
            next();
        });
    }

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

