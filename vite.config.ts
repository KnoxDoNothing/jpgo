import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import tailwind from '@tailwindcss/vite';import {VitePWA} from 'vite-plugin-pwa';
export default defineConfig({base:'./',plugins:[react(),tailwind(),VitePWA({registerType:'autoUpdate',includeAssets:['icon-180.png'],
manifest:{name:'年越し旅手帳',short_name:'旅手帳',display:'standalone',start_url:'./',scope:'./',theme_color:'#2B4C7E',background_color:'#F6F1E7',lang:'zh-TW',
icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},
workbox:{globPatterns:['**/*.{js,css,html,png,svg,json,webmanifest}']}})]});
