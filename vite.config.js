import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: 8000,
    },
    base: '',
    publicDir: 'public',
    build: {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: 'assets',
    },
})
