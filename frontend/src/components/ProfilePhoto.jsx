import React, { useState } from "react"

function ProfilePhoto({ src, alt }) {
    const [failed, setFailed] = useState(false)

    return <img src={failed ? "/portrait-fallback.svg" : src} alt={alt}
        className={failed ? "profile-photo-fallback" : undefined}
        draggable="false" onError={() => setFailed(true)} />
}

export default ProfilePhoto
