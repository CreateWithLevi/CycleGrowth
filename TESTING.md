# CycleGrowth Testing Guide

本文檔說明如何設置和運行 CycleGrowth 項目的測試。

## 測試架構概述

CycleGrowth 項目採用多層測試策略：

1. **單元測試** - 使用 Jest 和 React Testing Library 測試個別組件和函數
2. **集成測試** - 測試數據庫操作、API 路由和 Supabase Edge Functions
3. **端到端測試** - 使用 Playwright 測試完整的用戶工作流程

## 設置測試環境

### 1. 安裝依賴

```bash
npm install
```

### 2. 設置環境變量

創建 `.env.test.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://test-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
SUPABASE_SERVICE_KEY=test-service-key
NODE_ENV=test
```

### 3. Playwright 設置

```bash
npx playwright install
```

## 運行測試

### 單元測試和集成測試

```bash
# 運行所有測試
npm test

# 監視模式運行測試
npm run test:watch

# 生成覆蓋率報告
npm run test:coverage
```

### 端到端測試

```bash
# 運行 E2E 測試
npm run test:e2e

# 在瀏覽器中運行 E2E 測試
npm run test:e2e:headed

# 使用 UI 模式運行測試
npm run test:e2e:ui
```

## 測試結構

### 單元測試

位於 `src/**/__tests__/` 或 `src/**/*.test.{ts,tsx}` 文件中：

```
src/
├── components/
│   ├── ui/
│   │   └── __tests__/
│   │       └── button.test.tsx
│   └── form-message/
│       └── __tests__/
│           └── form-message.test.tsx
├── lib/
│   └── __tests__/
│       └── db.test.ts
└── app/
    └── actions/
        └── __tests__/
            └── actions.test.ts
```

### 端到端測試

位於 `e2e/` 目錄中：

```
e2e/
├── auth.spec.ts      # 認證流程測試
├── dashboard.spec.ts # 儀表板功能測試
└── utils/           # 測試工具
```

### Edge Function 測試

位於 `supabase/functions/__tests__/` 目錄中：

```
supabase/functions/
└── __tests__/
    └── create-growth-system.test.ts
```

## 測試工具和配置

### Jest 配置

- **配置文件**: `jest.config.js`
- **設置文件**: `jest.setup.js`
- **環境變量**: `jest.env.js`

### Playwright 配置

- **配置文件**: `playwright.config.ts`
- **瀏覽器**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

### Mock 和工具

測試工具位於 `src/__tests__/utils/`：

- `supabase-mock.ts` - Supabase 客戶端模擬
- `test-utils.tsx` - React Testing Library 包裝器

## 編寫測試

### 組件測試示例

```typescript
import React from 'react'
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils'
import { Button } from '../button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 數據庫測試示例

```typescript
import { fetchGrowthSystems } from "../db";
import { mockSupabaseClient } from "@/__tests__/utils/supabase-mock";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe("Database Operations", () => {
  it("should fetch growth systems", async () => {
    const result = await fetchGrowthSystems("test-user-id");

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
```

### E2E 測試示例

```typescript
import { test, expect } from "@playwright/test";

test("should sign in user", async ({ page }) => {
  await page.goto("/sign-in");

  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/.*dashboard/);
});
```

## 測試最佳實踐

### 單元測試

1. **AAA 模式**: Arrange, Act, Assert
2. **描述性測試名稱**: 說明測試的行為和期望
3. **隔離測試**: 每個測試應該獨立運行
4. **Mock 外部依賴**: 使用 Mock 來隔離被測試的單元

### 集成測試

1. **測試真實場景**: 測試組件之間的實際交互
2. **數據庫狀態管理**: 確保測試之間的數據清理
3. **錯誤處理**: 測試錯誤情況和邊界條件

### E2E 測試

1. **用戶視角**: 從用戶的角度編寫測試
2. **關鍵路徑**: 專注於最重要的用戶工作流程
3. **穩定的選擇器**: 使用數據屬性而不是 CSS 類
4. **等待策略**: 正確處理異步操作

## 覆蓋率目標

- **單元測試覆蓋率**: ≥ 80%
- **集成測試覆蓋率**: ≥ 70%
- **關鍵路徑 E2E 測試**: 100%

## CI/CD 集成

### GitHub Actions 配置

創建 `.github/workflows/test.yml`：

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run test:coverage
      - run: npx playwright install
      - run: npm run test:e2e
```

## 故障排除

### 常見問題

1. **測試超時**: 增加超時時間或優化異步操作
2. **Supabase 連接問題**: 檢查環境變量設置
3. **Playwright 失敗**: 確保瀏覽器已正確安裝

### 調試技巧

1. **Jest**: 使用 `--verbose` 標誌獲取詳細輸出
2. **Playwright**: 使用 `--headed` 模式查看瀏覽器操作
3. **測試隔離**: 使用 `test.only()` 運行單個測試

## 性能測試

### 指標監控

- **頁面加載時間**: < 3 秒
- **API 響應時間**: < 500ms
- **數據庫查詢時間**: < 200ms

### 工具

- **Lighthouse**: 網頁性能分析
- **Web Vitals**: 核心網頁指標
- **Load Testing**: 使用 k6 進行負載測試

## 安全測試

### 檢查項目

1. **認證流程**: 確保未授權訪問被阻止
2. **數據驗證**: 測試輸入驗證和清理
3. **SQL 注入**: 驗證數據庫查詢安全性
4. **XSS 防護**: 測試跨站腳本攻擊防護

## 無障礙測試

### 工具

- **axe-core**: 自動化無障礙測試
- **WAVE**: 網頁無障礙評估工具
- **Screen reader**: 手動測試

### 檢查項目

1. **鍵盤導航**: 確保所有功能可通過鍵盤訪問
2. **ARIA 標籤**: 正確的語義標記
3. **顏色對比**: 符合 WCAG 標準
4. **替代文本**: 圖片和媒體的描述

## 維護

### 定期任務

1. **更新依賴**: 保持測試工具最新
2. **清理測試**: 刪除過時或重複的測試
3. **性能監控**: 定期檢查測試執行時間
4. **覆蓋率審查**: 識別測試盲點

## 資源

- [Jest 文檔](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright 文檔](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)
