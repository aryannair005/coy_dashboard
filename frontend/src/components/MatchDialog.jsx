import React, { useEffect, useRef } from 'react'
import ProfilePhoto from './ProfilePhoto.jsx'

function MatchDialog({ profile, onClose, onMatches }) {
    const dialog = useRef(null);

    useEffect(() => {
        dialog.current.showModal();
    }, []);

    return (
        <dialog ref={dialog} className="match-dialog" aria-labelledby="match-title"
            onCancel={(event) => { event.preventDefault(); onClose(); }}>
            <span className="match-symbol" aria-hidden="true">♥</span>
            <h2 id="match-title">It’s a match!</h2>
            <ProfilePhoto src={profile.photo} alt="" />
            <p>You and <strong>{profile.name}</strong> liked each other.</p>
            <button className="pill primary" onClick={onMatches}>See matches</button>
            <button className="pill" onClick={onClose}>Keep discovering</button>
        </dialog>
    );
}


export default MatchDialog
