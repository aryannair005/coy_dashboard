const assert = require("node:assert/strict");
const test = require("node:test");
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { once } = require("node:events");
const { createApp } = require("../app.js");
const { createSwipeModel } = require("../models/swipe.model.js");

test("Discover API validates input and keeps incoming likes private", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'discover-api-'));
    const model = createSwipeModel(path.join(dir, 'swipes.json'));
    const server = createApp(model).listen(0, "127.0.0.1");
    await once(server, "listening");

    const url = `http://127.0.0.1:${server.address().port}`;
    const swipe = (profileId, direction) => fetch(`${url}/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, direction }),
    });

    try {
        const feedResponse = await fetch(`${url}/feed`);
        const { profiles } = await feedResponse.json();
        assert.equal(feedResponse.headers.get("cache-control"), "no-store");
        assert.equal(profiles.length, 30);
        assert.ok(profiles.every((profile) => Object.keys(profile).length === 7));
        assert.deepEqual(await (await fetch(`${url}/matches`)).json(), { matches: [] });
        assert.equal((await swipe(1, "invalid")).status, 400);
        assert.equal((await swipe(31, "like")).status, 404);
        assert.deepEqual(await (await swipe(4, "pass")).json(), {
            direction: "pass", matched: false, createdMatch: false,
        });

        const duplicateLikes = await Promise.all([swipe(1, "like"), swipe(1, "like")]);
        const results = await Promise.all(duplicateLikes.map((response) => response.json()));
        assert.equal(results.filter((result) => result.createdMatch).length, 1);

        const { matches } = await (await fetch(`${url}/matches`)).json();
        assert.deepEqual(matches.map(({ id }) => id), [1]);
        const nextFeed = await (await fetch(`${url}/feed`)).json();
        assert.equal(nextFeed.profiles.length, 28);
        assert.ok(nextFeed.profiles.every(({ id }) => id !== 1 && id !== 4));
    } finally {
        await new Promise((resolve) => server.close(resolve));
        rmSync(dir, { recursive: true, force: true });
    }
});


