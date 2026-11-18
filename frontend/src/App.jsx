import React, { useEffect, useState } from "react"
import ProfileCard from "./components/ProfileCard.jsx"
import MatchDialog from "./components/MatchDialog.jsx"

function App() {
    const [tab, setTab] = useState("discover")
    const [view, setView] = useState("feed")
    const [profiles, setProfiles] = useState([])
    const [matches, setMatches] = useState([])
    const [match, setMatch] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [feedback, setFeedback] = useState("")
    const [direction, setDirection] = useState("")
    const profile = profiles[0]

    async function loadPage(page) {
        setView(page)
        setLoading(true)
        setError("")

        try {
            const response = await fetch(page === "feed" ? "/feed" : "/matches")
            const data = await response.json()

            if (!response.ok) throw new Error(data.message)
            if (page === "feed") setProfiles(data.profiles)
            else setMatches(data.matches)
        } catch {
            setError("Could not load this page. Make sure the backend is running.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPage("feed")
    }, [])

    async function swipe(choice) {
        if (!profile || direction) return

        setDirection(choice)
        setFeedback("")

        try {
            const response = await fetch("/swipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId: profile.id, direction: choice }),
            })
            const data = await response.json()

            if (!response.ok) throw new Error(data.message)

            // Leave time for the outgoing card animation before showing the next card.
            await new Promise((resolve) => setTimeout(resolve, 240))
            setProfiles((current) => current.filter((item) => item.id !== profile.id))
            setFeedback(data.direction === "like" ? `Liked ${profile.name}` : `Passed on ${profile.name}`)
            if (data.createdMatch) setMatch(profile)
        } catch {
            setError("Could not save the swipe. Reload the feed to try again.")
        } finally {
            setDirection("")
        }
    }

    return (
        <div className="shell">
            {tab === "discover" && (
                <main>
                    <header className="brand" aria-label="Coy Discover demo">coy<span>.</span></header>
                    <div className="page-heading">
                        <h1>Discover</h1>
                        <button className="pill" disabled={loading || Boolean(direction)}
                            onClick={() => loadPage(view === "feed" ? "matches" : "feed")}>
                            {view === "feed" ? "♥  Matches" : "← Back to feed"}
                        </button>
                    </div>
                    <p className="sr-only" role="status">{feedback}</p>
                    {loading && <p role="status" className="empty">Loading…</p>}
                    {error && <div className="empty"><p role="alert">{error}</p>
                        <button className="pill" onClick={() => loadPage(view)}>Try again</button>
                    </div>}
                    {!loading && !error && view === "feed" && (
                        profile ? <>
                            <ProfileCard key={profile.id} profile={profile} direction={direction} onSwipe={swipe} />
                            <div className="actions">
                                <button className="pill" disabled={Boolean(direction)} onClick={() => swipe("pass")}>✕ <span>Pass</span></button>
                                <button className="pill primary" disabled={Boolean(direction)} onClick={() => swipe("like")}>♥ <span>Like</span></button>
                            </div>
                            <p className="hint">Swipe left to pass or right to like.</p>
                        </> : <div className="empty">
                            <h2>You’re all caught up</h2>
                            <p>You’ve seen every profile in this demo.</p>
                            <button className="pill" onClick={() => loadPage("matches")}>See matches</button>
                        </div>
                    )}
                    {!loading && !error && view === "matches" && (
                        matches.length > 0 ? <ul className="matches" aria-label="Mutual matches">
                            {matches.map((item) => <li key={item.id}>
                                <img src={item.photo} alt="" />
                                <div><strong>{item.name}, {item.age}</strong><span>{item.city}</span></div>
                                <span className="mutual">♥ Matched</span>
                            </li>)}
                        </ul> : <div className="empty">
                            <h2>No matches yet</h2>
                            <p>Your mutual matches will appear here.</p>
                        </div>
                    )}
                </main>
            )}
            <nav className="tabs" aria-label="Main navigation">
                <button aria-current={tab === "home" ? "page" : undefined}
                    disabled={Boolean(direction)} onClick={() => setTab("home")}>⌂ <span>Home</span></button>
                <button aria-current={tab === "discover" ? "page" : undefined}
                    disabled={Boolean(direction)} onClick={() => {
                        if (tab === "home" && !loading) loadPage(view)
                        setTab("discover")
                    }}>✦ <span>Discover</span></button>
            </nav>
            {match && <MatchDialog profile={match} onClose={() => setMatch(null)}
                onMatches={() => { setMatch(null); loadPage("matches") }} />}
        </div>
    )
}

export default App

