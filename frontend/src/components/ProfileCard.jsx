import React, { useRef, useState } from 'react'
import ProfilePhoto from './ProfilePhoto.jsx'

function ProfileCard({ profile, direction, onSwipe }) {
    const [distance, setDistance] = useState(0)
    const [dragging, setDragging] = useState(false)
    const startX = useRef(null)

    function startDrag(event) {
        if (direction || !event.isPrimary || event.button !== 0) return
        startX.current = event.clientX
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragging(true)
    }

    function moveDrag(event) {
        if (event.isPrimary && startX.current !== null) {
            setDistance(event.clientX - startX.current)
        }
    }

    function stopDrag() {
        startX.current = null
        setDistance(0)
        setDragging(false)
    }

    function finishDrag(event) {
        if (!event.isPrimary || startX.current === null) return
        const moved = event.clientX - startX.current
        stopDrag()

        if (moved >= 70) onSwipe("like")
        if (moved <= -70) onSwipe("pass")
    }

    const label = direction || (distance > 32 ? "like" : distance < -32 ? "pass" : "")
    const position = direction === "like" ? 600 : direction === "pass" ? -600 : distance

    return (
        <article className={`profile ${dragging ? "dragging" : ""} ${direction ? "leaving" : ""}`}
            style={{ "--x": `${position}px`, "--tilt": `${position / 25}deg` }}
            onPointerDown={startDrag} onPointerMove={moveDrag}
            onPointerUp={finishDrag} onPointerCancel={stopDrag}>
            <div className="portrait">
                <ProfilePhoto src={profile.photo} alt={`Illustrated portrait of ${profile.name}`} />
                {label && <span className={`stamp ${label}`}>{label.toUpperCase()}</span>}
            </div>
            <div className="profile-body">
                <div className="identity"><h2>{profile.name}, {profile.age}</h2><span className="city">{profile.city}</span></div>
                <p>{profile.bio}</p>
                <ul className="interests" aria-label="Interests">
                    {profile.interests.map((interest) => <li key={interest}>{interest}</li>)}
                </ul>
            </div>
        </article>
    )
}

export default ProfileCard

