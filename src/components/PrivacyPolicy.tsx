import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, User } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
  darkMode: boolean;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack, darkMode }) => {
  return (
    <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'} min-h-screen`}>
      <div className={`rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-lg overflow-hidden`}>
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className={`flex items-center text-sm font-medium transition-colors duration-200 ${
                darkMode
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </button>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-indigo-500" />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                プライバシーポリシー
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
            <div className={`leading-relaxed text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>
              
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-4">
                  最終更新日: 2024年1月1日
                </p>
                <p>
                  10分事件簿（以下「当サイト」）は、ユーザーの個人情報の保護を重要な責務と考え、
                  以下のプライバシーポリシーに従って個人情報を適切に取り扱います。
                </p>
              </div>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <User className="w-5 h-5 mr-2 text-indigo-500" />
                  1. 収集する情報
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">アカウント情報</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>メールアドレス</li>
                      <li>表示名</li>
                      <li>プロフィール情報（任意）</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">投稿内容</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>小説のタイトル、内容、タグ</li>
                      <li>いいね、コメント</li>
                      <li>投稿日時</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">利用状況</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>アクセスログ</li>
                      <li>利用統計情報</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Eye className="w-5 h-5 mr-2 text-indigo-500" />
                  2. 情報の利用目的
                </h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>サービスの提供・運営</li>
                  <li>ユーザー認証・アカウント管理</li>
                  <li>投稿内容の表示・管理</li>
                  <li>ユーザーサポート</li>
                  <li>サービスの改善・新機能開発</li>
                  <li>不正利用の防止</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Lock className="w-5 h-5 mr-2 text-indigo-500" />
                  3. 情報の保護
                </h2>
                <p className="mb-4">
                  当サイトは、ユーザーの個人情報を適切に保護するため、以下の措置を講じます：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL/TLS暗号化による通信の保護</li>
                  <li>アクセス制御による不正アクセスの防止</li>
                  <li>定期的なセキュリティ監査</li>
                  <li>従業員への情報保護教育</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Database className="w-5 h-5 mr-2 text-indigo-500" />
                  4. 第三者への提供
                </h2>
                <p className="mb-4">
                  当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>ユーザーの同意がある場合</li>
                  <li>法令に基づく場合</li>
                  <li>生命、身体または財産の保護のために必要な場合</li>
                  <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要な場合</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  5. ユーザーの権利
                </h2>
                <p className="mb-4">
                  ユーザーは、自己の個人情報について以下の権利を有します：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>個人情報の開示請求</li>
                  <li>個人情報の訂正・削除請求</li>
                  <li>個人情報の利用停止請求</li>
                  <li>アカウントの削除</li>
                </ul>
                <p className="mt-4">
                  これらの請求については、support@10minmystery.comまでご連絡ください。
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  6. Cookieの使用
                </h2>
                <p className="mb-4">
                  当サイトでは、サービスの改善とユーザー体験の向上のためにCookieを使用します。
                  ユーザーはブラウザの設定によりCookieを無効にすることができます。
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  7. プライバシーポリシーの変更
                </h2>
                <p>
                  当サイトは、必要に応じて本プライバシーポリシーを変更する場合があります。
                  重要な変更については、サイト上で通知いたします。
                </p>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  8. お問い合わせ
                </h2>
                <p>
                  本プライバシーポリシーに関するご質問やご不明な点がございましたら、
                  以下までお気軽にお問い合わせください。
                </p>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-white">10分事件簿 運営チーム</p>
                  <p className="text-gray-700 dark:text-gray-300">Email: support@10minmystery.com</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
