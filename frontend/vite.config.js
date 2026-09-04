import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Vite Configuration File
 * Configures Vite as the modern frontend build tool and development server.
 */
// https://vite.dev/config/
export default defineConfig({
  // PLUGINS: Enables official React support inside Vite
  // - Transforms JSX code into optimized standard JavaScript
  // - Enables Hot Module Replacement (HMR) so page edits update instantly without a full browser reload
  plugins: [react()],
})
