# Firebase設定手順

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名を入力（例：「10min-mystery」）
4. Google Analyticsは任意で有効化
5. プロジェクトを作成

## 2. Firestore Databaseの有効化

1. プロジェクトダッシュボードで「Firestore Database」をクリック
2. 「データベースを作成」をクリック
3. セキュリティルールを選択（開発中は「テストモード」を推奨）
4. ロケーションを選択（asia-northeast1（東京）を推奨）

## 3. Authenticationの有効化

1. 左メニューから「Authentication」をクリック
2. 「始める」をクリック
3. 「Sign-in method」タブで「メール/パスワード」を有効化

## 4. Webアプリの追加

1. プロジェクト設定（歯車アイコン）をクリック
2. 「全般」タブで「アプリを追加」→「Web」を選択
3. アプリのニックネームを入力（例：「10min-mystery-web」）
4. 「Firebase Hosting」はチェックしない
5. 「アプリを登録」をクリック
6. 設定オブジェクトをコピー

## 5. 環境変数の設定

プロジェクトルートに`.env`ファイルを作成し、以下の内容を追加：

```env
# Firebase設定
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# reCAPTCHA設定（オプション）
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
VITE_RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

## 6. セキュリティルールの設定

Firestore Databaseの「ルール」タブで以下のルールを設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザープロフィール
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 小説データ
    match /novels/{novelId} {
      // 誰でも読み取り可能
      allow read: if true;
      // 新規作成時は認証済みユーザーのみ
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
      // 更新・削除は作成者のみ
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 7. 動作確認

1. 開発サーバーを起動：`npm run dev`
2. ブラウザでアプリにアクセス
3. ユーザー登録・ログインを試す
4. プロフィール設定を試す

## トラブルシューティング

### エラー: "Firebase: Error (auth/configuration-not-found)"
- `.env`ファイルが正しく作成されているか確認
- 環境変数名が`VITE_`で始まっているか確認
- 開発サーバーを再起動

### エラー: "Firebase: Error (auth/invalid-api-key)"
- Firebase Consoleで正しいAPIキーをコピーしているか確認
- `.env`ファイルの値に余分なスペースがないか確認

### エラー: "Firebase: Error (firestore/permission-denied)"
- Firestoreのセキュリティルールを確認
- テストモードに設定されているか確認

## 本番環境での注意点

1. セキュリティルールを本番用に厳格化
2. 環境変数を本番環境に設定
3. Firebase Hostingを使用する場合は設定を追加
4. エラーログの監視設定
