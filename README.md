# 年越し旅手帳（日本跨年旅遊 PWA）
React + TypeScript + Vite + Tailwind v4 + vite-plugin-pwa（Service Worker）+ IndexedDB。資料只存手機本地。

## 目錄
```
index.html  vite.config.ts  tsconfig.json  package.json
public/     icon-180/192/512.png
src/main.tsx App.tsx store.tsx db.ts seed.ts types.ts utils.ts ui.tsx index.css
src/pages/  Home Plan MapPage Budget ExpForm Info (.tsx)
```
## 執行
`npm install` → `npm run dev`（開發）／`npm run build`（含型別檢查）→ `npm run preview`
## 部署（需 HTTPS）
把 `dist/` 上傳到 GitHub Pages、Cloudflare Pages 或 Netlify（已用相對路徑 base './'）。
## iPhone 安裝
用 Safari 開網址 → 分享 → 加入主畫面 → 之後都從主畫面圖示開啟（Safari 與主畫面 App 的資料彼此獨立）。
## 備份
資訊頁 → 匯出 JSON；換機或資料遺失時匯入。

## 備註
- 交通班次標示「✓已查」者來自官方或彙整來源；「待確認」者請用卡片內的 Google 地圖連結查當日時刻。
- 行程資料版本更新時，舊版自訂行程會被新版覆蓋（建議先匯出 JSON）。

## 更換 App 圖示
1. 準備 1024×1024 的 PNG（不要透明背景，主體放在中央約 80% 內），存成 `assets/icon-source.png`。
2. 執行 `python3 scripts/make-icons.py`（需要 Pillow），會產生 `public/icon-180.png`、`icon-192.png`、`icon-512.png`。也可以自己做這三個尺寸直接覆蓋。
3. `npm run build` 後重新部署。
4. iPhone 會快取主畫面圖示：先刪除舊的主畫面圖示，用 Safari 重新開網址，再「加入主畫面」。
