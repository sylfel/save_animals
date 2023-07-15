import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: 8000,
    },
    base: '/save_animals/',
    publicDir: 'public',
    build: {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: 'assets',
    },
})
