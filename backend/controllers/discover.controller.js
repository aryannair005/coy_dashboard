/**
 * @fileoverview Request handlers for the Discover dashboard.
 */

const { profiles } = require("../models/profile.model.js");

/** @route GET /feed */
const getFeed = (req, res) => {
    return res.status(200).json({ profiles: req.app.locals.swipes.getFeed() });
};

/** @route POST /swipe */
const recordSwipe = (req, res) => {
    const { profileId, direction } = req.body ?? {};

    if (!Number.isInteger(profileId) || !["like", "pass"].includes(direction)) {
        return res.status(400).json({ message: "Send a profileId and a direction of like or pass." });
    }

    if (!profiles.some((profile) => profile.id === profileId)) {
        return res.status(404).json({ message: "Profile not found." });
    }

    const result = req.app.locals.swipes.recordSwipe(profileId, direction);
    return res.status(200).json(result);
};

/** @route GET /matches */
const getMatches = (req, res) => {
    return res.status(200).json({ matches: req.app.locals.swipes.getMatches() });
};

module.exports = { getFeed, recordSwipe, getMatches };

