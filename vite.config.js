import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            isProduction: true,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            injectRegister: 'auto',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,eot,ttf}'],
                cleanupOutdatedCaches: true,
                skipWaiting: true,
                clientsClaim: true,
                sourcemap: true
            },
            manifest: {
                name: 'MotherCare',
                short_name: 'MCare',
                description: 'Mother Care App',
                // theme_color: '#ffffff',
                icons: [
                    {
                        src: 'icons/icon-128x128.png',
                        sizes: '128x128',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        sourcemap: true,
        // https://rollupjs.org/configuration-options/
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',

                assetFileNames: ({name}) => {
                    if (/\.(woff|woff2|eot|ttf)$/.test(name ?? '')){
                        return 'assets/fonts/[name]-[hash][extname]';
                    }

                    if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')){
                        return 'assets/[name]-[hash][extname]';
                    }

                    if (/\.css$/.test(name ?? '')) {
                        return 'assets/css/[name]-[hash][extname]';
                    }

                    // default value
                    // ref: https://rollupjs.org/guide/en/#outputassetfilenames
                    return 'assets/[name]-[hash][extname]';
                },
            },
        }
    },
})
