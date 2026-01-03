# ブログ管理アプリケーション - プロジェクト構成ドキュメント

このドキュメントは、ブログ管理アプリケーションの全体構成と、更新画面を作成するための参考情報をまとめたものです。

## 目次
- [プロジェクト構造](#プロジェクト構造)
- [使用技術スタック](#使用技術スタック)
- [ルーティング](#ルーティング)
- [既存画面一覧](#既存画面一覧)
- [APIエンドポイントとデータフロー](#apiエンドポイントとデータフロー)
- [コンポーネント構成](#コンポーネント構成)
- [状態管理](#状態管理)
- [データベーススキーマ](#データベーススキーマ)
- [更新画面実装時の必要項目](#更新画面実装時の必要項目)

---

## プロジェクト構造

```
blogadmin/
├── app/                           # Next.js App Router
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # ホーム（記事投稿画面）
│   ├── login/
│   │   └── page.tsx              # ログイン画面
│   ├── edit/
│   │   └── [slug]/               # 編集画面用（ページファイルは未作成）
│   └── new/                       # 新規作成用（ページファイルは未作成）
├── components/                    # Reactコンポーネント
│   ├── RichEditor.tsx            # リッチテキストエディタ（TipTap使用）
│   ├── TagInput.tsx              # タグ入力コンポーネント
│   ├── Logout.tsx                # ログアウトボタン
│   └── ui/
│       └── dialog.tsx            # RadixUIのDialog
├── actions/                       # Server Actions
│   ├── addBlog.ts                # ブログ記事作成
│   ├── addTag.ts                 # タグ作成
│   ├── getTagList.ts             # タグ一覧取得
│   ├── login.ts                  # ログイン
│   └── logout.ts                 # ログアウト
├── lib/                           # ユーティリティとAPI関連
│   ├── microcms.ts               # microCMS SDKラッパー
│   ├── utils.ts                  # clsx + tailwind-merge統合関数
│   └── validations/
│       └── blog.ts               # Zodバリデーションスキーマ
├── types/                         # TypeScript型定義
│   ├── blog.ts                   # ブログ記事の型
│   └── tag.ts                    # タグの型
├── hooks/                         # カスタムReactフック
│   └── useTagList.ts             # タグ一覧管理フック
├── constants/                     # 定数
│   └── index.ts                  # RICH_EDITOR_HEIGHT定数
├── proxies/                       # ミドルウェア・プロキシ
│   ├── jwt.ts                    # JWT検証
│   ├── basicAuth.ts              # Basic認証
│   └── ip.ts                     # IP制限（未使用）
├── proxy.ts                       # メインミドルウェア
├── package.json                  # 依存関係定義
├── tsconfig.json                 # TypeScript設定
├── next.config.ts                # Next.js設定
└── .env.local                    # 環境変数
```

---

## 使用技術スタック

### フレームワーク・ライブラリ
- **Next.js 16.0.10** - フルスタックフレームワーク
- **React 19.2.0** - UI フレームワーク
- **TypeScript 5** - 型安全性
- **Zod 4.3.4** - スキーマバリデーション

### UI/スタイリング
- **Tailwind CSS 4** - ユーティリティ優先のCSS
- **Radix UI** - アクセシブルなUIコンポーネント
  - @radix-ui/react-dialog
  - @radix-ui/react-visually-hidden
- **Lucide React 0.553.0** - アイコンライブラリ
- **class-variance-authority 0.7.1** - CSSクラス管理

### リッチテキスト編集
- **TipTap 3.11.0** - ProseMirrorベースのエディタ
- **TipTap Starter Kit** - デフォルトエクステンション

### 認証・セキュリティ
- **jose 6.1.2** - JWT生成・検証
- **argon2 0.44.0** - パスワードハッシュ化

### 外部API
- **microCMS JavaScript SDK 3.2.0** - ヘッドレスCMS統合

---

## ルーティング

### 現在のルート構造

| パス | ファイル | 機能 | 実装状況 |
|------|---------|------|---------|
| `/` | `app/page.tsx` | 記事投稿画面（ホーム） | ✅ 実装済み |
| `/login` | `app/login/page.tsx` | ログイン画面 | ✅ 実装済み |
| `/edit/[slug]` | `app/edit/[slug]/page.tsx` | 記事編集画面 | ❌ 未実装 |
| `/new` | `app/new/page.tsx` | 新規記事作成画面 | ❌ 未実装 |

### ミドルウェア・保護

`proxy.ts` がメインミドルウェアとして機能：
- development環境では保護スキップ
- `/login` は常にアクセス可能
- その他のルートは JWT 検証が必須（`proxies/jwt.ts`）
- JWT 検証失敗時は `/login` へリダイレクト

---

## 既存画面一覧

### 実装済み画面

#### 1. ログイン画面 (`/login`)
- ユーザー名とパスワード入力フォーム
- argon2によるパスワード検証
- JWT トークン発行とクッキー保存
- エラーメッセージ表示

#### 2. 記事投稿画面 (`/`)
- タイトル入力フィールド
- TipTap リッチテキストエディタ（本文）
- 公開日時指定（datetime-local）
- 下書きチェックボックス
- タグ選択・追加機能
- 投稿ボタン
- 結果ダイアログ表示
- ログアウトボタン

### 未実装機能
- 記事一覧画面
- 記事編集画面（`/edit/[slug]`）
- 記事削除機能
- 記事詳細表示

---

## APIエンドポイントとデータフロー

### MicroCMS エンドポイント

| エンドポイント | メソッド | 機能 | Server Action | 実装状況 |
|--------------|---------|------|---------------|---------|
| `/blog` | `POST` | 記事作成 | `addBlog()` | ✅ 実装済み |
| `/blog` | `GET` | 記事一覧取得 | `fetchBlogList()` | ❌ 未実装 |
| `/blog/{id}` | `GET` | 記事詳細取得 | `fetchBlog()` | ❌ 未実装 |
| `/blog/{id}` | `PUT` | 記事更新 | `updateBlog()` | ❌ 未実装 |
| `/blog/{id}` | `DELETE` | 記事削除 | `deleteBlog()` | ❌ 未実装 |
| `/tag` | `POST` | タグ作成 | `addTag()` | ✅ 実装済み |
| `/tag` | `GET` | タグ一覧取得 | `getTagList()` | ✅ 実装済み |

### データフロー（投稿時）

```
Client Component (page.tsx)
    ↓ onSubmit
Server Action (addBlog.ts)
    ↓ バリデーション (blogFormSchema)
lib/microcms.ts (createBlog)
    ↓ microCMS SDK
MicroCMS API
    ↓ response
Server Action → Client Component
    ↓ Dialog表示
```

---

## コンポーネント構成

### ページコンポーネント

#### `app/page.tsx` (投稿画面)

**State管理:**
- `isOpenDialog`: ダイアログ表示制御
- `isPostPending`: 投稿処理中フラグ
- `dialogContent`: ダイアログメッセージ
- `editorRef`: TipTapエディタ参照
- `newTagName`: 新規タグ入力値
- `selectedTagIds`: 選択タグID配列

**UI構成:**
```
ホーム（記事投稿）
├── タイトル入力
├── RichEditor（本文）
├── メタ情報（公開日、下書き）
├── TagInput（タグ選択）
├── 投稿ボタン
├── Dialog（結果通知）
└── Logout（ログアウト）
```

### 子コンポーネント

#### `components/RichEditor.tsx` (TipTapエディタ)
- TipTap Editor統合
- StarterKit エクステンション（デフォルトフォーマット）
- Placeholder サポート
- ResizeObserver でエディタ高さ自動調整
- 非表示 textarea で HTML 値送信

#### `components/TagInput.tsx` (タグ入力)
- `useTagList()` フックで状態管理
- タグ一覧表示（スクロール対応）
- キーワード検索・フィルタリング
- タグ追加ボタン
- チェックボックスで複数選択
- 選択済みタグ表示（削除ボタン付き）

#### `components/Logout.tsx` (ログアウト)
- ログアウトボタン
- `logout()` Server Action 呼び出し

#### `components/ui/dialog.tsx` (Radix UI Dialog)
- `DialogPrimitive` でアクセシブルなダイアログ実装
- 自動フォーカス管理
- ESC キーでクローズ
- `showCloseButton` prop でカスタマイズ可能

---

## 状態管理

### クライアント側 (React State)
- **ページレベル:** `useState()` で管理（page.tsx の form state）
- **カスタムフック:** `useTagList()` で tag 関連の状態を集約管理

### サーバー側 (Server Actions & Cookies)
- **認証状態:** JWT をセキュアな httpOnly Cookie に保存
- **セッション:** Cookie の JWT で認証状態を保持

### バリデーション
- **スキーマ:** Zod で型安全なバリデーション定義
- **実行:** Server Action 内で `safeParse()` で検証

#### `useTagList()` フック
- `tagList`: タグ一覧（ローカルキャッシュ）
- `isPendingLoad`: タグ読み込み中フラグ
- `isPendingAdd`: タグ追加中フラグ
- `addToTagList()`: タグ追加関数

---

## 型定義とデータスキーマ

このプロジェクトでは、MicroCMS との通信において **API投稿用の型** と **API取得用の型** を明確に分けて定義しています。

### 型の構造と使い分け

#### Blog（記事）の型定義

**ファイル:** `types/blog.ts`

```typescript
// ベース型（ジェネリック型）
export type Blog<T> = {
  title: string;                    // 記事タイトル
  body: string;                     // 記事本文（HTML）
  eyecatch?: MicroCMSImage;        // アイキャッチ画像（オプション）
  tags: T[];                        // タグの配列（型Tで抽象化）
}

// API取得用の型
export type BlogGet = Blog<TagGet> & MicroCMSContentId & MicroCMSDate;

// API投稿用の型
export type BlogPost = Blog<string> & Partial<MicroCMSDate>;
```

**型の使い分け:**

| 型名 | 用途 | tags の型 | 付加情報 |
|------|------|-----------|---------|
| `Blog<T>` | 基底となるジェネリック型 | `T[]`（可変） | - |
| `BlogGet` | MicroCMS から**取得**した記事データ | `TagGet[]`（完全なタグオブジェクト） | `id`, `createdAt`, `updatedAt`（必須） |
| `BlogPost` | MicroCMS へ**投稿・更新**する記事データ | `string[]`（タグのIDのみ） | `publishedAt`（オプション） |

**重要な違い:**
- **BlogGet**: APIから返される記事データ。タグは完全な `TagGet` オブジェクト（id、name、createdAt、updatedAt を含む）
- **BlogPost**: APIに送信する記事データ。タグは ID 文字列の配列のみ。MicroCMS が自動付与するフィールド（id、createdAt、updatedAt）は含まない

#### Tag（タグ）の型定義

**ファイル:** `types/tag.ts`

```typescript
// ベース型
export type Tag = {
  name: string;                     // タグ名
}

// API取得用の型
export type TagGet = Tag & MicroCMSContentId & MicroCMSDate;

// API投稿用の型
export type TagPost = Tag & Partial<MicroCMSDate>;
```

**型の使い分け:**

| 型名 | 用途 | 含まれるフィールド |
|------|------|--------------------|
| `Tag` | 基底型 | `name` のみ |
| `TagGet` | MicroCMS から**取得**したタグデータ | `name`, `id`, `createdAt`, `updatedAt` |
| `TagPost` | MicroCMS へ**投稿**するタグデータ | `name`, `publishedAt`（オプション） |

#### MicroCMS SDK 提供の型

```typescript
// MicroCMS が自動付与する ID フィールド
type MicroCMSContentId = {
  id: string;
}

// MicroCMS が自動付与する日時フィールド
type MicroCMSDate = {
  createdAt: string;     // 作成日時（ISO 8601）
  updatedAt: string;     // 更新日時（ISO 8601）
  publishedAt?: string;  // 公開日時（ISO 8601、オプション）
  revisedAt?: string;    // 改訂日時（ISO 8601、オプション）
}

// 画像データの型
type MicroCMSImage = {
  url: string;
  width?: number;
  height?: number;
}
```

### バリデーションスキーマ

```typescript
const blogFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  body: z.string().default(''),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().optional(),
  isDraft: z.boolean().default(false),
})
```

---

## 記事投稿画面の実装パターン（更新画面作成の参考）

### 1. Form セットアップ

```typescript
const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  // UTC変換処理（重要）
  const localPublishedAt = formData.get('publishedAt');
  if (typeof localPublishedAt === 'string' && localPublishedAt !== '') {
    const utc = new Date(localPublishedAt).toISOString();
    formData.set('publishedAt', utc);
  }

  const response = await addBlog(formData);
  // ...
}
```

### 2. Server Action パターン

`actions/addBlog.ts` の実装パターン：

```typescript
'use server'

export type AddBlogResponse = {
  error: true;
  message?: string;
  errors?: Record<string, string[]>;
} | {
  error: false;
  id: string;
};

export default async function addBlog(formData: FormData): Promise<AddBlogResponse> {
  // 1. FormData を raw object に変換
  const raw = {
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? ''),
    tags: formData.getAll('tags').map(tag => String(tag)),
    publishedAt: String(formData.get('publishedAt') ?? '').trim(),
    isDraft: String(formData.get('isDraft') ?? '') === 'on' ? true : false,
  }

  // 2. Zod バリデーション
  const validatedFields = blogFormSchema.safeParse(raw);
  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      error: true,
      message: 'バリデーションエラーが発生しました',
      errors: flattenedErrors.fieldErrors,
    };
  }

  // 3. MicroCMS へ作成リクエスト
  try {
    const response = await createBlog(content, isDraft);
    return {
      error: false,
      id: response.id,
    };
  } catch(e) {
    return {
      error: true,
      message: e instanceof Error ? e.message : 'ブログの作成に失敗しました',
    };
  }
}
```

### 3. TipTap エディタ統合

```typescript
const editorRef = useRef<Editor|null>(null);

// フォーム送信後リセット
editorRef.current?.commands.clearContent();

// コンポーネント使用
<RichEditor name="body" editorRef={(editor) => editorRef.current = editor}/>

// textarea で HTML を送信
<textarea name={name} className="hidden" value={html} readOnly></textarea>
```

---

## 更新画面実装時の必要項目

記事更新画面（`/edit/[slug]`）を実装する際に必要な項目のチェックリスト：

### 1. ページファイル作成
- [ ] `app/edit/[slug]/page.tsx` を新規作成
- [ ] Dynamic Route パラメータ `[slug]` から記事IDを取得

### 2. データ取得機能の実装

#### Server Action
- [ ] `actions/getBlog.ts` を新規作成
  - 記事ID を受け取り、記事詳細を返す

#### microCMS ラッパー関数
- [ ] `lib/microcms.ts` に `fetchBlog(id)` 関数を追加
  - `client.get({ endpoint: 'blog', contentId: id })` を呼び出し

### 3. 更新機能の実装

#### Server Action
- [ ] `actions/updateBlog.ts` を新規作成
  - `addBlog.ts` を参考に、`PUT` メソッドを使用
  - 記事ID をパラメータとして受け取る
  - バリデーションは既存の `blogFormSchema` を再利用

#### microCMS ラッパー関数
- [ ] `lib/microcms.ts` に `updateBlog(id, content, isDraft)` 関数を追加
  - `client.update({ endpoint: 'blog', contentId: id, content })` を呼び出し

### 4. UI 実装

- [ ] 投稿画面（`app/page.tsx`）のコードをベースにする
- [ ] 既存データをフォームに初期値として設定
  - タイトル入力フィールドに `defaultValue`
  - エディタに既存のHTMLをロード
  - タグを事前選択状態にする
  - 公開日時を設定
  - 下書き状態を反映
- [ ] ボタンテキストを「投稿」→「更新」に変更
- [ ] ページタイトルを「記事の編集」に変更

### 5. オプション機能

#### 削除機能
- [ ] 削除ボタンを追加
- [ ] `actions/deleteBlog.ts` を新規作成
- [ ] `lib/microcms.ts` に `deleteBlog(id)` 関数を追加
  - `client.delete({ endpoint: 'blog', contentId: id })` を呼び出し
- [ ] 削除確認ダイアログの実装

#### その他
- [ ] 記事一覧画面の実装（編集画面へのリンク追加）
- [ ] プレビュー機能
- [ ] 画像アップロード機能（eyecatch）

---

## 環境変数設定

`.env.local` に以下が設定済み：

```
ADMIN_USER              # 管理者ユーザー名
ADMIN_PASS              # argon2ハッシュ化パスワード
JWT_ALG                 # JWT署名アルゴリズム（HS256）
JWT_KEY                 # Base64エンコードされた JWT 秘密鍵
MICROCMS_SERVICE_DOMAIN # microCMS ドメイン
MICROCMS_API_KEY        # microCMS API キー
```

---

## 参考リンク

- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [microCMS JavaScript SDK](https://github.com/microcmsio/microcms-js-sdk)
- [TipTap ドキュメント](https://tiptap.dev/)
- [Zod ドキュメント](https://zod.dev/)
- [Radix UI ドキュメント](https://www.radix-ui.com/)
