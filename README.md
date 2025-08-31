# 10分間ミステリー小説アプリ

React + TypeScript + Firebaseを使用したミステリー小説投稿・閲覧アプリです。

## 機能

- ミステリー小説の投稿・編集・削除
- 小説の検索・フィルタリング
- ユーザー認証（サインアップ・サインイン）
- リアルタイムデータベース（Firestore）
- レスポンシブデザイン

## 技術スタック

- **フロントエンド**: React 18, TypeScript, Tailwind CSS
- **バックエンド**: Firebase (Firestore, Authentication)
- **ビルドツール**: Vite
- **パッケージマネージャー**: npm

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd 10minitutesMistery
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Firebaseプロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. Webアプリを追加
4. 以下の設定値を取得：
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### 4. 環境変数の設定 ⚠️ 重要

**セキュリティのため、環境変数ファイルは絶対にGitにコミットしないでください！**

プロジェクトルートに`.env`ファイルを作成し、以下の内容を記入：

```env
VITE_FIREBASE_API_KEY=AIzaSyC...（実際のAPI Key）
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**環境変数ファイルの例（実際の値は含めない）：**
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firebase Authenticationの有効化

1. Firebase Consoleで「Authentication」を選択
2. 「Sign-in method」タブで「メール/パスワード」を有効化

### 6. Firestore Databaseの設定

1. Firebase Consoleで「Firestore Database」を選択
2. 「データベースを作成」をクリック
3. セキュリティルールを以下のように設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /novels/{novelId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリを確認できます。

## ビルド

```bash
npm run build
```

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── Header.tsx      # ヘッダー
│   ├── HeroSection.tsx # ヒーローセクション
│   ├── NovelForm.tsx   # 小説投稿フォーム
│   ├── NovelList.tsx   # 小説一覧
│   └── NovelDetail.tsx # 小説詳細
├── types/              # TypeScript型定義
│   └── Novel.ts       # 小説の型定義
├── utils/              # ユーティリティ関数
│   ├── firebase.ts    # Firebase設定
│   ├── firestoreService.ts # Firestore操作
│   ├── authService.ts # 認証操作
│   └── database.ts    # データベース操作
└── App.tsx            # メインアプリコンポーネント
```

## 主要な機能の実装

### 小説の投稿

- `NovelForm.tsx`で小説の投稿フォームを実装
- Firestoreにデータを保存
- 文字数制限（8000-10000文字）のバリデーション

### 認証システム

- Firebase Authenticationを使用
- メール/パスワードでのサインアップ・サインイン
- 認証状態の管理

### データベース操作

- Firestoreを使用したリアルタイムデータベース
- CRUD操作（作成・読み取り・更新・削除）
- 検索・フィルタリング機能

## セキュリティと注意事項 ⚠️

### 絶対にやってはいけないこと
- **`.env`ファイルをGitにコミットしない**
- **Firebase設定値を公開リポジトリにアップロードしない**
- **API Keyをコードに直接記述しない**

### 推奨事項
- `.env`ファイルは`.gitignore`に含まれていることを確認
- 本番環境では適切なセキュリティルールを設定
- 環境変数は開発チーム内でのみ共有
- 定期的にAPI Keyをローテーション

### トラブルシューティング
- 環境変数が読み込まれない場合：Viteの再起動を試してください
- Firebase接続エラー：設定値とプロジェクト設定を確認してください

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
