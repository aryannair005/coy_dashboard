const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createSwipeModel } = require("../models/swipe.model.js");

test("swipes persist and only matching likes appear in Matches", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "discover-model-"));
    const file = path.join(dir, "data", "swipes.json");

    try {
        const model = createSwipeModel(file);
        const feed = model.getFeed();
        assert.equal(feed.length, 30);
        assert.equal(new Set(feed.map(({ id }) => id)).size, 30);
        assert.ok(feed.every(({ photo }) =>
            fs.existsSync(path.join(__dirname, "../../frontend/public", photo))));
        assert.deepEqual(Object.keys(feed[0]).sort(),
            ["age", "bio", "city", "id", "interests", "name", "photo"]);
        assert.deepEqual(model.getMatches(), []);

        assert.equal(model.recordSwipe(1, "like").createdMatch, true);
        assert.equal(model.recordSwipe(2, "like").createdMatch, false);
        assert.equal(model.recordSwipe(4, "pass").createdMatch, false);
        assert.equal(model.recordSwipe(1, "like").createdMatch, false);
        assert.equal(model.recordSwipe(4, "like").matched, false);

        const reopened = createSwipeModel(file);
        assert.deepEqual(reopened.getMatches().map(({ id }) => id), [1]);
        assert.equal(reopened.getFeed().length, 27);
        assert.ok(reopened.getFeed().every(({ id }) => ![1, 2, 4].includes(id)));

        for (const profile of reopened.getFeed()) {
            reopened.recordSwipe(profile.id, "pass");
        }

        assert.deepEqual(reopened.getFeed(), []);
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});
