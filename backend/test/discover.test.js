const assert = require("node:assert/strict");
const test = require("node:test");
const { mkdirSync, mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { once } = require("node:events");
const { createApp } = require("../app.js");
const { createSwipeModel } = require("../models/swipe.model.js");

test("Discover API validates input and keeps incoming likes private", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'discover-api-'));
    const file = path.join(dir, 'swipes.json');
    const model = createSwipeModel(file);
    const server = createApp(model, "https://demo.netlify.app").listen(0, "127.0.0.1");
    await once(server, "listening");

    const url = `http://127.0.0.1:${server.address().port}`;
    const swipe = (profileId, direction) => fetch(`${url}/swipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, direction }),
    });

    try {
        const preflight = await fetch(`${url}/swipe`, {
            method: "OPTIONS",
            headers: {
                Origin: "https://demo.netlify.app",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        });
        assert.equal(preflight.status, 204);
        assert.equal(preflight.headers.get("access-control-allow-origin"), "https://demo.netlify.app");
        assert.ok(preflight.headers.get("access-control-allow-methods").includes("POST"));
        assert.equal(preflight.headers.get("access-control-allow-headers"), "Content-Type");
        const otherOrigin = await fetch(`${url}/feed`, { headers: { Origin: "https://other.example" } });
        assert.equal(otherOrigin.headers.get("access-control-allow-origin"), null);

        const feedResponse = await fetch(`${url}/feed`);
        const { profiles } = await feedResponse.json();
        assert.equal(feedResponse.headers.get("cache-control"), "no-store");
        assert.equal(profiles.length, 30);
        assert.ok(profiles.every((profile) => Object.keys(profile).length === 7));
        assert.deepEqual(await (await fetch(`${url}/matches`)).json(), { matches: [] });
        assert.equal((await swipe(1, "invalid")).status, 400);
        assert.equal((await swipe(31, "like")).status, 404);
        assert.equal((await swipe("1", "like")).status, 400);
        const malformed = await fetch(`${url}/swipe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{",
        });
        assert.equal(malformed.status, 400);
        assert.deepEqual(await (await swipe(2, "like")).json(), {
            direction: "like", matched: false, createdMatch: false,
        });
        assert.deepEqual(await (await swipe(4, "pass")).json(), {
            direction: "pass", matched: false, createdMatch: false,
        });

        const duplicateLikes = await Promise.all([swipe(1, "like"), swipe(1, "like")]);
        const results = await Promise.all(duplicateLikes.map((response) => response.json()));
        assert.equal(results.filter((result) => result.createdMatch).length, 1);

        const { matches } = await (await fetch(`${url}/matches`)).json();
        assert.deepEqual(matches.map(({ id }) => id), [1]);
        const nextFeed = await (await fetch(`${url}/feed`)).json();
        assert.equal(nextFeed.profiles.length, 27);
        assert.ok(nextFeed.profiles.every(({ id }) => ![1, 2, 4].includes(id)));
        assert.equal(JSON.parse(readFileSync(file, "utf8")).length, 3);

        // Blocking the temporary file path forces the real storage write to fail.
        mkdirSync(file + ".tmp");
        const failed = await swipe(3, "like");
        assert.equal(failed.status, 500);
        assert.deepEqual(await failed.json(), { message: "Something went wrong. Try again." });
        assert.deepEqual(await (await fetch(`${url}/feed`)).json(), nextFeed);
        rmSync(file + ".tmp", { recursive: true });

        for (const { id } of nextFeed.profiles) {
            assert.equal((await swipe(id, "pass")).status, 200);
        }
        assert.deepEqual(await (await fetch(`${url}/feed`)).json(), { profiles: [] });
        assert.deepEqual((await (await fetch(`${url}/matches`)).json()).matches.map(({ id }) => id), [1]);
    } finally {
        await new Promise((resolve) => server.close(resolve));
        rmSync(dir, { recursive: true, force: true });
    }
});


