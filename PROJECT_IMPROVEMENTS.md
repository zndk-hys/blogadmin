# プロジェクト構成の改善提案

このドキュメントは、Next.js 16 と React 19 のベストプラクティスに基づいた、ブログ管理アプリケーションの改善提案をまとめたものです。

## 目次

- [改善点の概要](#改善点の概要)
- [現在の構成について](#現在の構成について)
- [1. エラーハンドリングの追加](#1-エラーハンドリングの追加)
- [2. 環境変数の型安全性](#2-環境変数の型安全性)
- [3. 認証ロジックの整理](#3-認証ロジックの整理)
- [4. バリデーションスキーマの統合](#4-バリデーションスキーマの統合)
- [5. レスポンス型の統一](#5-レスポンス型の統一)
- [6. フォルダ構成の最適化（オプション）](#6-フォルダ構成の最適化オプション)
- [7. テスト構成の追加](#7-テスト構成の追加)
- [8. その他の小さな改善](#8-その他の小さな改善)
- [実装チェックリスト](#実装チェックリスト)

---

## 改善点の概要

| 項目 | 優先度 | 影響範囲 | 理由 |
|------|--------|----------|------|
| エラーハンドリング追加 | 🔴 高 | ユーザー体験 | エラー時の UX 改善、デバッグ容易化 |
| 環境変数の型安全性 | 🔴 高 | 設定管理 | ランタイムエラー防止 |
| 認証ロジックの整理 | 🟡 中 | 認証全体 | コードの可読性・保守性向上 |
| バリデーションスキーマ統合 | 🟡 中 | バリデーション | 一貫性、再利用性向上 |
| レスポンス型の統一 | 🟡 中 | API レスポンス | 一貫性、型安全性向上 |
| フォルダ構成最適化 | 🟢 低 | プロジェクト全体 | スケーラビリティ（大規模化時）|
| テスト構成追加 | 🟢 低 | 品質保証 | 長期的な保守性向上 |

---

## 現在の構成について

### ✅ 正しく実装されている項目

**1. proxy.ts - Next.js 16 の標準ファイル名**

現在の `proxy.ts` は **Next.js 16 の正式な命名規則に準拠しています**。

```typescript
// proxy.ts - Next.js 16 では正しい
export async function proxy(request: NextRequest) {
  // ...
}

export const config = {
  matcher: [...]
}
```

> **Note:** Next.js 15 以前では `middleware.ts` が使われていましたが、Next.js 16 では `proxy.ts` に変更されました。現在の実装は正しいため、変更の必要はありません。

**2. actions/ ディレクトリ配置**

ルート直下の `actions/` ディレクトリは有効な配置です。Next.js では `'use server'` ディレクティブを使えば、Server Actions をどこに配置しても機能します。

```
blogadmin/
└── actions/
    ├── addBlog.ts
    ├── addTag.ts
    ├── getTagList.ts
    ├── login.ts
    └── logout.ts
```

この配置でも問題ありませんが、将来的にアクションが増えた場合は、機能別にグループ化することを検討できます。

---

## 1. エラーハンドリングの追加

### 優先度: 🔴 高

### 現状の問題

**欠けているファイル:**
- `app/error.tsx` - エラーバウンダリ
- `app/loading.tsx` - ローディング状態
- `app/not-found.tsx` - 404ページ

**問題点:**
- エラー発生時にユーザーフレンドリーな表示がない
- ローディング状態が明示的でない
- デバッグが困難

### 実装例

#### `app/error.tsx` (新規作成)

```typescript
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md space-y-4 p-6 text-center">
        <h2 className="text-2xl font-bold">エラーが発生しました</h2>
        <p className="text-muted-foreground">
          申し訳ございません。問題が発生しました。
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 overflow-auto rounded bg-gray-100 p-4 text-left text-sm">
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          再試行
        </button>
      </div>
    </div>
  )
}
```

#### `app/loading.tsx` (新規作成)

```typescript
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  )
}
```

#### `app/not-found.tsx` (新規作成)

```typescript
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md space-y-4 p-6 text-center">
        <h2 className="text-4xl font-bold">404</h2>
        <p className="text-xl font-semibold">ページが見つかりません</p>
        <p className="text-muted-foreground">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}
```

### マイグレーション手順

1. `app/error.tsx` を作成
2. `app/loading.tsx` を作成
3. `app/not-found.tsx` を作成
4. 動作確認（エラーを意図的に発生させてテスト）

---

## 2. 環境変数の型安全性

### 優先度: 🔴 高

### 現状の問題

```typescript
// 型安全性がない
const apiKey = process.env.MICROCMS_API_KEY // string | undefined
```

**問題点:**
- 環境変数が存在しない場合にランタイムエラー
- 型推論が効かない（常に `string | undefined`）
- スペルミスを検出できない

### 実装例

#### `lib/env.ts` (新規作成)

```typescript
import { z } from 'zod'

/**
 * 環境変数のスキーマ定義
 */
const envSchema = z.object({
  // 認証
  ADMIN_USER: z.string().min(1, 'ADMIN_USER is required'),
  ADMIN_PASS: z.string().min(1, 'ADMIN_PASS is required'),

  // JWT
  JWT_ALG: z.string().default('HS256'),
  JWT_KEY: z.string().min(1, 'JWT_KEY is required'),

  // MicroCMS
  MICROCMS_SERVICE_DOMAIN: z.string().min(1, 'MICROCMS_SERVICE_DOMAIN is required'),
  MICROCMS_API_KEY: z.string().min(1, 'MICROCMS_API_KEY is required'),

  // Node環境
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

/**
 * 環境変数の型
 */
export type Env = z.infer<typeof envSchema>

/**
 * 環境変数の検証とエクスポート
 */
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map((e) => e.path.join('.')).join(', ')
      throw new Error(
        `環境変数の検証に失敗しました: ${missing}\n` +
        `.env.local ファイルを確認してください。`
      )
    }
    throw error
  }
}

/**
 * 型安全な環境変数
 *
 * @example
 * import { env } from '@/lib/env'
 * const apiKey = env.MICROCMS_API_KEY // string（型安全）
 */
export const env = validateEnv()
```

### 使用例

#### Before (型安全でない)

```typescript
// lib/microcms.ts
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!, // 危険
  apiKey: process.env.MICROCMS_API_KEY!,              // 危険
})
```

#### After (型安全)

```typescript
// lib/microcms.ts
import { env } from '@/lib/env'

const client = createClient({
  serviceDomain: env.MICROCMS_SERVICE_DOMAIN, // 型安全、必ず存在
  apiKey: env.MICROCMS_API_KEY,               // 型安全、必ず存在
})
```

### マイグレーション手順

1. `lib/env.ts` を作成
2. 全ての `process.env.*` を `env.*` に置換
3. 起動時に環境変数が検証されることを確認
4. `.env.local.example` を作成（テンプレート用）

#### `.env.local.example` (新規作成)

```bash
# 管理者認証
ADMIN_USER=admin
ADMIN_PASS=$argon2id$v=19$m=65536,t=3,p=4$...

# JWT設定
JWT_ALG=HS256
JWT_KEY=your-base64-encoded-secret-key

# MicroCMS
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# Node環境
NODE_ENV=development
```

---

## 3. 認証ロジックの整理

### 優先度: 🟡 中

### 現状の問題

```
blogadmin/
├── proxy.ts              # ✅ Next.js 16 標準
└── proxies/
    ├── jwt.ts           # JWT検証ロジック
    ├── basicAuth.ts     # 未使用？
    └── ip.ts            # 未使用？
```

**問題点:**
- `proxies/` ディレクトリに認証ロジックが配置されているが、`lib/auth/` の方が意味的に適切
- 未使用のファイル（`basicAuth.ts`, `ip.ts`）が残っている可能性

### 推奨される改善

```
blogadmin/
├── proxy.ts              # そのまま維持
└── lib/
    └── auth/
        ├── jwt.ts       # JWT 検証・生成ロジック
        └── password.ts  # パスワード検証（必要に応じて）
```

### 実装例

#### `lib/auth/jwt.ts` (proxies/jwt.ts から移動・改善)

```typescript
import { jwtVerify, SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

const secret = Buffer.from(env.JWT_KEY, 'base64')

/**
 * JWT トークンを生成
 */
export async function signJWT(payload: { userId: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: env.JWT_ALG })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

/**
 * JWT トークンを検証
 */
export async function verifyJWT(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret, {
      algorithms: [env.JWT_ALG],
    })
    return true
  } catch (error) {
    console.error('JWT verification failed:', error)
    return false
  }
}

/**
 * リクエストの JWT を検証（proxy.ts で使用）
 * @returns 拒否の場合はNextResponse、許可の場合はnull
 */
export async function verifyJwtFromRequest(request: NextRequest): Promise<NextResponse | null> {
  const jwt = request.cookies.get('jwt')?.value

  if (!jwt) {
    return redirectToLogin(request)
  }

  const isValid = await verifyJWT(jwt)
  if (!isValid) {
    return redirectToLogin(request)
  }

  return null
}

/**
 * ログイン画面へのリダイレクトレスポンス生成
 */
function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url)
}
```

#### `proxy.ts` (更新)

```typescript
import { NextRequest, NextResponse } from "next/server"
import { verifyJwtFromRequest } from "@/lib/auth/jwt"

export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // ログイン画面は常にアクセス許可
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // JWT検証
  const invalidJwt = await verifyJwtFromRequest(request)
  if (invalidJwt) {
    return invalidJwt
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
```

### マイグレーション手順

1. `lib/auth/` ディレクトリを作成
2. `proxies/jwt.ts` の内容を `lib/auth/jwt.ts` に移動・改善
3. `proxy.ts` のインポートを更新
4. 未使用の `proxies/basicAuth.ts`, `proxies/ip.ts` を削除
5. `proxies/` ディレクトリを削除
6. 動作確認

---

## 4. バリデーションスキーマの統合

### 優先度: 🟡 中

### 現状の問題

```
lib/
└── validations/
    └── blog.ts                # ブログのみ
```

**問題点:**
- タグやログインのバリデーションスキーマが未定義
- 将来的に増えると管理が煩雑

### 推奨される改善

#### `lib/validations/schemas.ts` (統合)

```typescript
import { z } from 'zod'

// ============================================
// ブログ関連スキーマ
// ============================================

/**
 * ブログ投稿フォームのスキーマ
 */
export const blogFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  body: z.string().default(''),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().optional(),
  isDraft: z.boolean().default(false),
})

/**
 * ブログフォームの型
 */
export type BlogFormInput = z.infer<typeof blogFormSchema>

// ============================================
// タグ関連スキーマ
// ============================================

/**
 * タグ作成スキーマ
 */
export const tagCreateSchema = z.object({
  name: z.string().min(1, 'タグ名は必須です').max(50, 'タグ名は50文字以内で入力してください'),
})

/**
 * タグフォームの型
 */
export type TagFormInput = z.infer<typeof tagCreateSchema>

// ============================================
// 認証関連スキーマ
// ============================================

/**
 * ログインフォームのスキーマ
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'ユーザー名は必須です'),
  password: z.string().min(1, 'パスワードは必須です'),
})

/**
 * ログインフォームの型
 */
export type LoginFormInput = z.infer<typeof loginSchema>

// ============================================
// 共通バリデーションヘルパー
// ============================================

/**
 * Zodエラーをフィールドエラーの形式に変換
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors = error.flatten().fieldErrors
  return Object.fromEntries(
    Object.entries(fieldErrors).map(([key, value]) => [
      key,
      value ?? [],
    ])
  )
}
```

### マイグレーション手順

1. `lib/validations/schemas.ts` を作成
2. 既存の `blog.ts` の内容を移動
3. タグとログインのスキーマを追加
4. `formatZodErrors` ヘルパーを作成
5. 既存コードのインポートを更新
6. `lib/validations/blog.ts` を削除

---

## 5. レスポンス型の統一

### 優先度: 🟡 中

### 現状の問題

各 Server Action が独自のレスポンス型を定義している可能性があります。

**問題点:**
- 一貫性がない
- 型定義が重複

### 推奨される改善

#### `types/api.ts` (新規作成)

```typescript
/**
 * Server Action の統一レスポンス型
 *
 * @template T 成功時のデータ型
 */
export type ActionResponse<T = void> =
  | ActionSuccessResponse<T>
  | ActionErrorResponse

/**
 * 成功レスポンス
 */
export type ActionSuccessResponse<T> = {
  success: true
  data: T
}

/**
 * エラーレスポンス
 */
export type ActionErrorResponse = {
  success: false
  error: string
  errors?: Record<string, string[]>
}

/**
 * ページネーション付きレスポンス
 */
export type PaginatedResponse<T> = {
  items: T[]
  totalCount: number
  offset: number
  limit: number
}

/**
 * よく使う型のエイリアス
 */
export type BlogActionResponse = ActionResponse<{ id: string }>
export type TagActionResponse = ActionResponse<{ id: string }>
export type AuthActionResponse = ActionResponse<void>
```

### 使用例

```typescript
// actions/addBlog.ts
import type { ActionResponse } from '@/types/api'

export async function addBlog(
  formData: FormData
): Promise<ActionResponse<{ id: string }>> {
  // バリデーション失敗
  if (!result.success) {
    return {
      success: false,
      error: 'バリデーションエラー',
      errors: formatZodErrors(result.error),
    }
  }

  // 成功
  try {
    const response = await createBlog(data)
    return {
      success: true,
      data: { id: response.id },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラー',
    }
  }
}
```

### マイグレーション手順

1. `types/api.ts` を作成
2. 全ての Server Action のレスポンス型を `ActionResponse<T>` に変更
3. クライアント側のエラーハンドリングを更新
4. 動作確認

---

## 6. フォルダ構成の最適化（オプション）

### 優先度: 🟢 低

この改善は、プロジェクトが大規模化した場合に検討してください。現在の規模では必須ではありません。

### 推奨される構成（将来的に検討）

```
blogadmin/
├── app/
│   ├── (auth)/                      # 認証ルートグループ
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx               # 認証専用レイアウト
│   ├── (blog)/                      # ブログルートグループ
│   │   ├── page.tsx                 # / (投稿画面)
│   │   ├── edit/[slug]/
│   │   │   └── page.tsx
│   │   └── layout.tsx               # ブログ専用レイアウト
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── layout.tsx
├── actions/                         # 現状維持でOK
├── components/
├── lib/
├── types/
├── hooks/
├── constants/
└── proxy.ts
```

**Route Groups のメリット:**
- URL パスに影響を与えない
- 関連するルートを論理的にグループ化
- グループごとに異なる `layout.tsx` を持てる

---

## 7. テスト構成の追加

### 優先度: 🟢 低

### 推奨されるテスト構成

```
blogadmin/
├── __tests__/
│   ├── unit/
│   │   ├── lib/
│   │   │   ├── auth/
│   │   │   │   └── jwt.test.ts
│   │   │   └── validations/
│   │   │       └── schemas.test.ts
│   │   └── actions/
│   │       ├── addBlog.test.ts
│   │       └── login.test.ts
│   └── e2e/
│       ├── login.test.ts
│       └── blog-create.test.ts
├── vitest.config.ts
└── playwright.config.ts
```

### 実装例: Vitest セットアップ

#### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

### パッケージのインストール

```bash
# Vitest + React Testing Library
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom

# Playwright (E2Eテスト)
npm install -D @playwright/test
npx playwright install
```

---

## 8. その他の小さな改善

### 8.1 TypeScript 設定の最適化

#### `tsconfig.json` に追加推奨

```json
{
  "compilerOptions": {
    // より厳格な型チェック
    "noUncheckedIndexedAccess": true,

    // パスエイリアスの追加（必要に応じて）
    "paths": {
      "@/*": ["./*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  }
}
```

### 8.2 未使用ファイルの削除

以下のファイルが使用されていない場合は削除を検討:
- `proxies/basicAuth.ts`
- `proxies/ip.ts`

---

## 実装チェックリスト

### Phase 1: 重要度高（即座に対応推奨）

- [ ] **エラーハンドリングの追加**
  - [ ] `app/error.tsx` を作成
  - [ ] `app/loading.tsx` を作成
  - [ ] `app/not-found.tsx` を作成
  - [ ] 動作確認

- [ ] **環境変数の型安全性**
  - [ ] `lib/env.ts` を作成
  - [ ] 全ての `process.env.*` を `env.*` に置換
  - [ ] `.env.local.example` を作成
  - [ ] 動作確認

### Phase 2: 重要度中（余裕があれば対応）

- [ ] **認証ロジックの整理**
  - [ ] `lib/auth/` ディレクトリを作成
  - [ ] `proxies/jwt.ts` を `lib/auth/jwt.ts` に移動・改善
  - [ ] `proxy.ts` のインポートを更新
  - [ ] 未使用ファイルを削除
  - [ ] 動作確認

- [ ] **バリデーションスキーマの統合**
  - [ ] `lib/validations/schemas.ts` を作成
  - [ ] タグ・ログインスキーマを追加
  - [ ] `formatZodErrors` ヘルパーを追加
  - [ ] 既存コードを更新

- [ ] **レスポンス型の統一**
  - [ ] `types/api.ts` を作成
  - [ ] Server Actions の型を統一
  - [ ] クライアント側のハンドリングを更新

### Phase 3: 重要度低（長期的な改善）

- [ ] **フォルダ構成の最適化**（プロジェクト大規模化時）
  - [ ] Route Groups を検討
  - [ ] レイアウトの分離を検討

- [ ] **テスト構成の追加**
  - [ ] Vitest をインストール・設定
  - [ ] 重要な機能のテストを作成

- [ ] **その他の改善**
  - [ ] TypeScript 設定を最適化
  - [ ] 未使用ファイルを削除

---

## まとめ

### ✅ 現在正しく実装されている項目

- `proxy.ts` - Next.js 16 の標準ファイル名
- `actions/` ディレクトリ配置 - 有効な配置

### 🔴 優先的に対応すべき項目

1. エラーハンドリングの追加（UX 改善）
2. 環境変数の型安全性（ランタイムエラー防止）

### 🟡 余裕があれば対応すべき項目

3. 認証ロジックの整理（保守性向上）
4. バリデーションスキーマの統合（一貫性向上）
5. レスポンス型の統一（型安全性向上）

このドキュメントの改善を実装することで、より保守性が高く、型安全で、ユーザーフレンドリーなアプリケーションになります。
