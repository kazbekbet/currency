import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable.png'],

      manifest: {
        name: 'Currency Converter',
        short_name: 'Currency',
        description: 'Конвертер валют RUB · THB · USD · EUR с реальными курсами',
        theme_color: '#0a0815',
        background_color: '#0a0815',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        shortcuts: [
          {
            name: 'USD → RUB',
            short_name: 'USD→RUB',
            url: '/?from=USD&to=RUB',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'USD → THB',
            short_name: 'USD→THB',
            url: '/?from=USD&to=THB',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'RUB → THB',
            short_name: 'RUB→THB',
            url: '/?from=RUB&to=THB',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'EUR → RUB',
            short_name: 'EUR→RUB',
            url: '/?from=EUR&to=RUB',
            icons: [{ src: 'icon-192.png', sizes: '192x192' }],
          },
        ],

        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },

      workbox: {
        // Cache static assets (JS, CSS, fonts) — cache first
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],

        // Runtime caching for currency API endpoints
        runtimeCaching: [
          {
            // Live rates — network first, fall back to cache (1 day)
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@fawazahmed0\/currency-api/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'currency-api-live',
              expiration: { maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Fallback API endpoint
            urlPattern: /^https:\/\/latest\.currency-api\.pages\.dev/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'currency-api-fallback',
              expiration: { maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Historical rates — stale-while-revalidate (data doesn't change)
            urlPattern: /^https:\/\/.*currency-api.*\/v1\/currencies\/usd\.json/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'currency-api-historical',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
})
