eThing Standard V2 — 專案分析摘要

▎ 定位：面向工業 IoT 場域的空氣品質監測與設備管理平台，前端以 React 18 + TypeScript 建構，具備多租戶、多角色、ChatBot 等企業級能力。

---

1. 功能模組

平台共有 21 個獨立功能模組，依業務域分群：

- **場域管理**：區域 (Area)、分組 (Group)、標準分組 (Standard Group)
- **設備管理**：設備列表 + 詳情、傳感器、設備類型、設備檔案 (Profile)、傳感器數據
- **告警管理**：告警規則、通知渠道、告警歷史、灑水控制（Dashboard / Control / Settings / Logs）
- **圖表分析**：趨勢分析、標準差、時間特徵、玫瑰圖 (Rose)、時空回播 (SpatioPlayback)
- **後台管理**：公司、使用者、角色、菜單、公司菜單授權、操作日誌
- **AI 入口**：ChatBot（支援 text / quick-reply / select / action 四種訊息類型）

設計取向：模組邊界清晰，每個功能域有獨立 feature/ 目錄，不互相侵入；灑水、圖表等複雜流程均拆成子頁面，路由層級對應業務深度。

---

2. 系統架構

2.1 前端分層架構（三層 + 橫切關注點）

- **Pages / Features** — UI 呈現、使用者互動
- **Services** — 業務邏輯、資料轉換、i18n 錯誤
- **APIs** — HTTP 請求、型別定義
- **HttpClient** — Token 刷新、請求重試、登出攔截
- 橫切：AuthContext（認證）、MenuContext（權限）、React Query（快取）

2.2 認證與多租戶模型

- User 物件包含角色層級（role.level）與所屬公司的 isRoot 旗標
- 超管（isRoot && level === 0）可在登入後切換操作公司，useCompanyFilter hook 封裝此邏輯，各頁面零感知
- 菜單即權限：後端回傳菜單樹 → 平坦化為路徑集合 → 路由守衛比對，權限粒度到路由級

2.3 BaseURL 三段優先鏈

window.**APP_CONFIG** → import.meta.env → fallback: localhost:8080

同一個 Docker Image 可在不換建的前提下部署到 Staging 或 Production，由容器啟動時 docker-entrypoint.sh 動態寫入 /config.js。

---

3. 前端技術

- **框架**：React 18 + TypeScript 5 — hooks-first，嚴格型別保護
- **建構**：Vite 5 + pnpm 10 — HMR 毫秒級，frozen-lockfile 保證可重現建構
- **UI**：shadcn/ui（Radix UI + Tailwind）— 無頭元件 + utility-first，40+ 基礎元件，dark mode 開箱即用
- **狀態**：TanStack React Query 5 — 伺服器狀態與 loading/error/cache 自動化管理
- **路由**：wouter 3 — 輕量（< 3kB），API 接近 react-router
- **表單**：react-hook-form + zod — 型別安全的 schema 驅動驗證，跨前後端共用 schema（shared/schema.ts）
- **圖表**：Recharts + ECharts — 按需選型：Recharts 應對趨勢線，ECharts 應對玫瑰圖特殊需求
- **地圖**：Leaflet + react-leaflet — 時空回播功能使用
- **動畫**：framer-motion — 流暢的 UI 轉場
- **i18n**：i18next（3 namespace：common / validation / fields）— 驗證錯誤訊息也可在地化

Tailwind safelist 設計：Sidebar 使用動態類名，透過 safelist 明確保留，避免 tree-shaking 誤刪 CSS。

---

4. API 整合

HttpClient 的工程質量亮點

Token 刷新 — 訂閱者模式（避免併發競爭）

請求 A → 401 → 開始刷新 → isRefreshing = true
請求 B → 401 → 排入 subscribers[]（等待）
請求 C → 401 → 排入 subscribers[]（等待）
↓
刷新成功 → 廣播新 token → A/B/C 全部用新 token 重試
↓
刷新失敗 → 呼叫 logoutHandler → 跳轉登入

這個模式確保高頻操作頁面不會因 token 過期產生多次刷新競爭。

ApiError 統一業務碼：throw new ApiError(code, message) 讓呼叫端以業務碼（數字）判斷錯誤型別，而非比對字串，類型安全且易於維護。

Service 層職責：API 層回傳 snake_case；Service 層負責轉換成 camelCase 並包裝 i18n 錯誤訊息，讓 UI 層只處理業務邏輯。

---

5. Docker 相關配置

多階段建構（Image 體積最小化）：

Stage 1 (builder) — node:20-alpine
→ pnpm install --frozen-lockfile
→ tsc（型別檢查）
→ vite build

Stage 2 (runtime) — nginx:1.27-alpine
→ COPY dist/ → /usr/share/nginx/html
→ COPY docker-entrypoint.sh
→ COPY nginx.conf

Nginx 快取策略：

- `/config.js` — no-store, no-cache（每次動態注入）
- `*.js, *.css, *.woff2...` — expires 1y; immutable（Hash 命名保證唯一）
- **SPA 路由** — try_files $uri /index.html（前端路由支援）

---

6. CI/CD 相關配置

GitLab Pipeline — 5 個 Stage 的設計哲學：

install → quality → build → package → deploy

- **install**：--frozen-lockfile + pnpm-lock.yaml 作為 cache key，精確緩存命中
- **quality**：TypeScript tsc 型別檢查在 build 前獨立出來，fail fast
- **build**：CI 環境變數寫入 .env 再 build，保持建構可重現性
- **package**：develop 分支 → :staging tag；vX.Y.Z tag → :latest + :版本號
- **deploy**：Production 部署前多一道防護：確認 commit 在 main 上才允許部署，防止未合入 main 的 tag 直接上線

Deploy 階段透過 SSH 遠端操作目標主機：拉新 Image → 停舊容器 → 起新容器 → sed 更新 Nginx upstream port → nginx -s reload，零停機換版。

---

7. 可觀察到的重構痕跡

從 git log 與分支命名可讀出明確的演進軌跡：

- feature/ → feat2/ 命名切換：主管 merge 後，新一輪開發統一用 feat2/ 前綴，舊 feature/ 封存，分支歷史有明確的里程碑感
- ApiError 統一引入（commit 670dff3）：原本分散的 try/catch + message 重構為 ApiError class + 業務碼，Service 層統一使用
- RoseChart datepicker revert（commit 79d3d49）：有意識地將日期選擇器回退為 Input，等待 feat2/datepicker-migration
  統一升級，顯示跨功能依賴的主動治理
- ChatBot 新增（commit 5d30f13）：獨立 feature，不影響既有模組，完整支援四種訊息類型並有 mockData 支援開發測試
- SpatioPlayback handleAlarmClick early return（commit 5e5aa17）：功能性暫時停用有 commit message 說明，非靜默遺棄

---

8. 可觀察到的測試設計

- **E2E**：Playwright（playwright.config.ts 已配置）— 基礎框架到位
- **型別安全**：TypeScript 嚴格模式 + CI tsc — 每次 MR 強制通過
- **Mock 資料**：src/mock/mockData.ts + ChatBot chatbotMock.ts — 開發/UI 驗證用，儀表板有 toggle 切換
- **Schema 共用**：shared/schema.ts 前後端共用 Zod schema — 減少前後端型別漂移

測試策略偏向「型別優先 + E2E 保底」的現代前端風格，避免過度 mock 的脆弱單元測試。

---

9. 文件與開發流程

- README.md：快速開始、環境變數、Docker 操作、CI 變數說明，覆蓋 onboarding 路徑
- docs/INSTALL.md：詳細安裝與部署手冊（含 Nginx 反向代理設定）
- .env.example：環境變數樣板，新成員 cp .env.example .env 即可啟動
- api.ts JSDoc 說明 baseURL 優先鏈：內嵌文件，不需要查外部說明
- 分支命名約定：feat2/ 前綴對應新一輪開發，datepicker-migration 等語意化名稱代表跨頁面的重構計畫
- Commit message 中文：業務意圖直接可讀，revert 原因也附在訊息內

---

專案亮點

1. 同一 Image 跨環境部署：docker-entrypoint.sh + runtime config 模式，Staging / Production 用同一個 artifact，不重複 build
2. 多租戶超管切換：useCompanyFilter hook 封裝超管跨公司操作，21 個模組透明複用，沒有 props drilling
3. Token 刷新訂閱者模式：高頻操作不會產生競爭條件，一次刷新廣播給所有等待請求
4. CI Production 防護：自動驗證 tag commit 是否在 main 上，架構層面防止誤部署
5. 時空回播功能：在地圖上重播歷史感測數據，比靜態圖表提供更直覺的時空洞察

---

工程亮點

1. 三層架構 + 橫切關注點分離：API → Service → Feature，每層職責單一，易於單獨替換後端
2. ApiError class 業務碼設計：呼叫端用數字碼而非字串比對錯誤，類型安全
3. Zod schema 前後端共用（shared/）：減少型別漂移，驗證邏輯只寫一次
4. Tailwind safelist 有意識管理：動態類名不靠「碰運氣」存活，明確宣告
5. Nginx 雙層快取策略：靜態資源永久快取 + config.js 永不快取，兼顧效能與動態性
6. datepicker 跨模組遷移計畫：主動拆出 feat2/datepicker-migration 分支，而不是讓各頁面各自為政

---

AI Agent 參與的工作類型

在這個專案中，AI Agent（Claude Code）主要參與：

- **架構設計**：API 五層封裝架構、ApiError 統一錯誤處理、認證/權限設計文件（可複用 prompt 已存入記憶）
- **元件開發**：ChatBot 元件（四種訊息類型）、ChatBot resize handle、RoseChart / SpatioPlayback 圖表頁面
- **重構協助**：ApiError class 引入與統一、datepicker 遷移計畫的分支策略建議
- **配置生成**：GitLab CI/CD .gitlab-ci.yml（含 production 安全防護邏輯）、docker-entrypoint.sh、nginx.conf
- **問題診斷**：Port 衝突（Hyper-V EACCES）、CORS、容器連線問題的診斷流程（已存入記憶）
- **決策記錄**：分支命名約定、datepicker 暫緩決策、各模組架構設計 prompt — 透過記憶系統保留跨對話脈絡

AI Agent 的最大紅利在於架構決策的加速：在設計認證架構或 API 封裝架構時，AI 能在一次對話內提出完整方案、指出邊界情況（如 Token
刷新競爭）、並直接產出可執行的程式碼，壓縮了通常需要資深工程師數天的設計討論週期。

---

適合放入作品集的內容

技術面

- Token 刷新訂閱者模式（src/config/api.ts:80+）— 展示對 async 競爭條件的工程處理能力
- 多租戶超管架構（useCompanyFilter + AuthContext）— 展示企業級權限模型設計
- Docker Runtime Config 注入（Dockerfile + docker-entrypoint.sh）— 展示 DevOps 思維的實踐

產品面

- 時空回播（SpatioPlayback）：地圖 + 時間軸的動態可視化，是平台中技術密度最高的功能
- ChatBot AI 入口：四種訊息類型的對話介面，展示將 AI 能力整合進既有業務系統的路徑
- 完整的灑水管理流程：從儀表板 → 控制 → 設定 → 日誌，四頁面完整業務流

工程流程面

- GitLab CI/CD Pipeline with Production Guard：展示對 DevOps 風險管理的意識
- 分支命名與遷移計畫策略：展示在多人協作下的技術債治理能力
