const { profiles, incomingLikes } = require("./profile.model.js");
const { readSwipes, saveSwipes } = require("../utils/swipeFile.js");

function createSwipeModel(file) {
    function getFeed() {
        const swipes = readSwipes(file);
        return profiles.filter((profile) => !swipes.some((swipe) => swipe.profileId === profile.id));
    }

    function recordSwipe(profileId, direction) {
        const swipes = readSwipes(file);
        const previous = swipes.find((swipe) => swipe.profileId === profileId);

        if (previous) {
            return { direction: previous.direction, matched: previous.matched, createdMatch: false };
        }

        const matched = direction === "like" && incomingLikes.has(profileId);
        swipes.push({ profileId, direction, matched });
        saveSwipes(file, swipes);

        return { direction, matched, createdMatch: matched };
    }

    function getMatches() {
        const swipes = readSwipes(file);
        return profiles.filter((profile) =>
            swipes.some((swipe) => swipe.profileId === profile.id && swipe.direction === "like" && swipe.matched === true)
        );
    }

    return { getFeed, recordSwipe, getMatches };
}

module.exports = { createSwipeModel };

