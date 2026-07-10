# HAiCook — Random Cooking Inspiration Card

一個單頁互動宣傳網頁，用於推廣 HAiCook 料理 APP。使用者可以選擇想要的主食類型，
點擊按鈕後隨機抽出一張「料理靈感卡」，並在卡片下方導引使用者下載 HAiCook APP。

## ✅ 目前已完成功能

1. **單頁面、單檔案**：`index.html` 內含 HTML / CSS / JavaScript，開啟即可直接使用，無需伺服器或建置流程。
2. **溫暖乾淨的料理品牌風格**：米白 + 淺奶油色漸層背景，並疊加以食物表情符號（🍳🥕🌿🍅🥔🍲🍜）組成的低透明度重複圖案（透過 inline SVG data URI 實現、無外部圖片依賴），覆蓋整個頁面背景，搭配柔和綠（sage）與咖啡色（coffee）作為主色調，字型使用 Poppins + Quicksand。手機版會自動縮小圖案尺寸以維持視覺比例。
3. **頁面標題與副標題**
   - 主標題：「Not sure what to cook today?」
   - 副標題：「Get a random recipe idea and get inspired in seconds.」
4. **抽卡前的主食選擇（Step 1）**（標題：「What are you craving today?」）
   - 使用按鈕式選項（chip 樣式、四欄網格排列），提供：Rice、Pasta、Bread、Noodles、Potato、Soup、Salad / Bowl、Dessert 共 **八種**主食類型。
   - 選擇任一主食後，才會啟用「Spin for a Recipe Idea」按鈕（未選擇時按鈕為禁用灰色狀態）。
   - 選項下方另外提供一個獨立的「🔀 Surprise Me — Spin Now」按鈕（以「or」分隔線區隔），**點擊後不需要先選擇主食，會直接立即從全部料理中隨機抽卡**，方便完全不想選擇、只想馬上獲得靈感的使用者。
5. **隨機抽卡（Step 2）**
   - 點擊「Spin for a Recipe Idea」後，會從符合所選主食類型（Main Base）的料理池中隨機挑選一張卡片顯示。
   - 點擊「Surprise Me — Spin Now」時，會從全部 56 筆資料中直接隨機抽取並立即顯示結果（並自動清除已選中的主食 chip，避免畫面狀態混淆）。
   - 具備「避免連續兩次抽到同一道菜」的邏輯（在候選池允許的情況下）。
6. **抽卡前的卡片堆疊預覽**：在使用者尚未點擊「Spin for a Recipe Idea」前，卡片區域不會是空白，而是以「多張卡片重疊」的視覺呈現（後方兩張卡片以不同角度、透明度堆疊，模擬一疊料理卡片），最上層卡片中央顯示一個帶有脈動動畫的大大的「?」問號，並附上提示文字「Choose a main base above, then hit spin to reveal your recipe idea!」。點擊 Spin 抽出第一張卡片時，卡片堆疊會以淡出+縮小動畫消失，並被真正的料理卡片取代。

7. **料理靈感卡內容**（採「開書 Book-Style」雙欄版面設計，圖片 + 介紹 + 難易度 + 為什麼你會喜歡 + 完整食材份量 + 料理步驟）：每張卡片皆包含
   - **Dish Image（料理圖片）**：使用 loremflickr.com 提供的公開圖片 URL，依料理名稱關鍵字動態產生，顯示於卡片頂部，右上角疊加 Main Base 類別徽章。
   - **左頁（Left Page）**：
     - **Dish Name + Difficulty（料理名稱與難易度標籤）**：標題與難易度並排顯示，難易度以彩色圓角標籤呈現（Easy 綠色／Medium 橘色／Hard 紅色），一眼辨識烹調難度。
     - **料理介紹（Description）**：3~4 句話的完整段落，涵蓋料理特色、烹調方式、風味亮點與適合的食用情境。
     - **為什麼你會喜歡這道料理（Why You'll Love It）**：以帶有愛心圖示、淺綠色左側色條的重點提示框呈現，重新加回卡片畫面中，強化情感連結與吸引力。
     - **完整食材與份量（Ingredients）**：以條列清單呈現每道菜的完整食材與具體份量（例如「350g spaghetti」「2 cloves garlic, minced」），方便使用者直接採買與備料。
   - **右頁（Right Page）**：
     - **料理步驟（Steps）**：移至卡片右側獨立「書頁」呈現，標題為「Cooking Steps」並搭配翻書圖示，以編號步驟清單呈現完整烹調流程（每道菜 4~5 個步驟），搭配綠色圓形數字標記，讓使用者可以直接照著步驟完成整道料理。
   - **書本視覺呈現（Book-Style Layout）**：卡片內容區以 CSS Grid 分為左右兩欄（各佔 50%），中間以漸層陰影模擬「書脊」摺線效果，右頁並套用略深的米色背景與左頁做出區隔，整體呈現如同翻開一本食譜書的視覺感受。當螢幕寬度小於 768px（平板/手機）時，版面會自動收合為單欄垂直排列（右頁改以上方虛線分隔取代書脊陰影），確保小螢幕閱讀體驗。
   - **文字可讀性優化**：卡片內文（Description 段落、Why You'll Love It、食材清單、步驟清單）字級已放大並加粗（字重 600～800），確保清晰易讀，手機版亦同步調整對應字級。
8. **超過 50 組料理資料**：目前資料庫共 **64 組**料理卡片，平均分布於 Rice、Pasta、Bread、Noodles、Potato、Soup、Salad / Bowl、Dessert 八大主食類別（每類 8 筆），內容以歐美市場常見、適合家庭、上班族與新手的家常料理為主。新增的 Salad / Bowl 類別包含 Greek Salad、Chicken Caesar Salad、Buddha Bowl、Poke Bowl、Cobb Salad、Quinoa Power Bowl、Caprese Salad、Asian Chicken Salad Bowl 等 8 道料理。
9. **CTA 區塊**：頁面下方**固定常駐顯示**（不需等待抽卡即可看到）：
   - 文案：「Want more recipe ideas? Download HAiCook and generate recipes with your ingredients.」
   - 兩個官方樣式商店徽章圖示按鈕：
     - `images/app-store-badge.svg`（Apple 官方「Download on the App Store」黑底徽章，取自 developer.apple.com 官方素材）
     - `images/google-play-badge.png`（Google 官方「GET IT ON Google Play」黑底徽章，取自 play.google.com 官方素材）
   - 兩張徽章皆已下載存放於專案 `images/` 資料夾中，非外部連結圖片，載入更穩定，樣式與 Apple / Google 官方標準徽章完全一致（黑底、圓角、白色圖示與文字）。
10. **動畫效果**
   - 抽卡前的卡片堆疊：問號帶有脈動（pulse）動畫，吸引使用者點擊。
   - 首次抽卡：卡片堆疊淡出縮小，新卡片淡入 + 輕微彈跳（bounce）效果。
   - 之後每次重新抽卡：卡片會有 3D 翻轉退出（flip-out）再翻轉進入（flip-in）的動畫，模擬「翻牌」抽卡的趣味感。
   - 主食選項 chip 具備 hover / active 過渡動畫。
11. **Responsive 設計**：以 Flexbox + 相對單位排版，斷點設定於 480px 以下，針對手機版調整字級、間距、按鈕排列（商店按鈕改為直式排列）等，桌機與手機瀏覽皆美觀。
12. **原生技術**：完全使用原生 HTML / CSS / JavaScript，未使用 React 或其他前端框架；僅引用 Google Fonts 與 Font Awesome（圖示用）兩個 CDN 資源，無其他外部套件依賴。

## 🔗 功能入口 / 使用方式

- **檔案路徑**：`index.html`（單頁應用，無其他路由或參數）
- **操作流程**：
  1. 開啟 `index.html`
  2. 在「What are you craving today?」區塊選擇一個主食類型（或選 Surprise Me）
  3. 點擊「Spin for a Recipe Idea」按鈕
  4. 檢視隨機出現的料理靈感卡
  5. 可重複點擊按鈕繼續抽卡（會有翻牌動畫），並在卡片下方看到 App 下載 CTA

## ⚠️ 尚待正式上線前需要替換的項目

在 `index.html` 中已使用註解標明以下兩處，**目前為 `#` 佔位連結，正式上線前請替換成真實商店網址**：

```html
<!-- 🔗 REPLACE '#' BELOW with your real App Store link -->
<a href="#" class="store-btn apple" id="appStoreLink" ...>

<!-- 🔗 REPLACE '#' BELOW with your real Google Play link -->
<a href="#" class="store-btn google" id="googlePlayLink" ...>
```

## 🚧 尚未實作 / 可優化項目

- 目前料理圖片使用 `loremflickr.com` 依關鍵字隨機提供圖片，圖片內容可能與料理不完全 100% 精準對應（僅供示意）；正式上線建議替換為 HAiCook 官方拍攝或授權的料理實拍圖。
- 尚未串接後端資料庫，所有 64 筆料理資料皆為前端寫死（hard-coded）在 JavaScript 陣列中，如需由營運端動態新增/編輯料理卡片，需另外串接 Table API 或後台管理系統。
- 尚未加入「分享至社群」或「收藏喜愛料理」等社交/會員功能。
- 尚未加入多語系（目前內容以英文為主，符合英語市場需求，如需中文版可另外製作 i18n 切換）。
- 尚未加入實際下載追蹤（如 App Store / Google Play 點擊事件的分析埋點，例如 GA4 / Meta Pixel）。

## 💡 建議下一步開發方向

1. 將 App Store / Google Play 連結替換為正式商店網址。
2. 視覺素材替換為 HAiCook 官方料理拍攝圖，加強品牌一致性。
3. 若需要動態管理料理卡片內容，可建立 Table API（例如 `recipes` 資料表），欄位對應現有的 name、difficulty、mainBase、image、description、ingredientsList（陣列）、steps（陣列），並將前端資料來源由寫死陣列改為 `fetch('tables/recipes')`。
4. 加入下載按鈕點擊事件追蹤，評估行銷頁成效。
5. 視需求加入多語系切換（EN / 中文）。

## 🗂️ 資料模型（目前為前端內嵌資料，非資料庫）

每筆料理卡片物件結構如下（JavaScript 物件，儲存於 `index.html` 內的 `RECIPES` 陣列）：

```js
{
  name: "Dish Name",
  cuisine: "Cuisine / Country",           // 保留於資料中，目前卡片畫面未顯示
  ingredients: "Main Ingredients",        // 簡短版，保留於資料中作為備用摘要
  mood: "Cooking Mood",                   // 保留於資料中，目前卡片畫面未顯示
  difficulty: "Easy | Medium | Hard",
  why: "Why You'll Love It",              // 已重新顯示於卡片左頁「為什麼你會喜歡這道料理」區塊
  mainBase: "Rice | Pasta | Bread | Noodles | Potato | Soup | Salad | Dessert",
  image: "https://... (公開圖片 URL)",
  description: "Short Description",
  ingredientsList: ["350g spaghetti", "400g ground beef", "..."],   // 完整食材與份量（陣列，卡片畫面顯示用）
  steps: ["Step 1 instruction", "Step 2 instruction", "..."]          // 料理步驟（陣列，卡片畫面顯示用，通常 4~5 步）
}
```

目前卡片畫面實際顯示欄位為：`image`、`name`、`difficulty`、`description`、`why`、`ingredientsList`、`steps`（`why` 顯示於卡片左頁的「為什麼你會喜歡這道料理」提示框，`steps` 顯示於卡片右頁的「Cooking Steps」書頁）；`cuisine`、`ingredients`（簡短版）、`mood` 欄位仍保留在資料中以利未來擴充或還原舊版顯示，但目前卡片 UI 未渲染。若未來需要後端持久化，可依此結構建立對應的 Table Schema（欄位型別建議：name/text, cuisine/text, ingredients/text, mood/text, difficulty/text(options), why/rich_text, mainBase/text(options), image/text, description/rich_text, ingredientsList/array, steps/array）。

## 🌐 公開網址

尚未發布。請至 **Publish 頁籤** 一鍵發布本專案，發布後即可取得正式線上網址。
