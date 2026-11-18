import { defineConfig } from "vite"

export default defineConfig({
    server: {
        proxy: {
            "/feed": "http://127.0.0.1:3000",
            "/swipe": "http://127.0.0.1:3000",
            "/matches": "http://127.0.0.1:3000",
        },
    },
})

