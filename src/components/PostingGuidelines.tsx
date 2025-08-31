import React from 'react';
import { ArrowLeft, BookOpen, PenTool, AlertTriangle, CheckCircle, Clock, Hash } from 'lucide-react';

interface PostingGuidelinesProps {
  onBack: () => void;
  darkMode: boolean;
}

const PostingGuidelines: React.FC<PostingGuidelinesProps> = ({ onBack, darkMode }) => {
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
              <BookOpen className="w-6 h-6 text-indigo-500" />
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                投稿ガイドライン
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
                  10分事件簿では、すべてのユーザーが快適に小説を読んだり書いたりできるよう、
                  以下のガイドラインを設けています。投稿前に必ずお読みください。
                </p>
              </div>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <PenTool className="w-5 h-5 mr-2 text-indigo-500" />
                  基本ルール
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">推奨事項</h3>
                        <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
                          <li>オリジナルのミステリー小説を投稿してください</li>
                          <li>読者にとって読みやすい文章を心がけてください</li>
                          <li>適切なタグを付けて作品を分類してください</li>
                          <li>他のユーザーの作品を尊重してください</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">禁止事項</h3>
                        <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-300">
                          <li>著作権侵害となる作品の投稿</li>
                          <li>暴力的、性的、差別的な内容</li>
                          <li>スパムや宣伝目的の投稿</li>
                          <li>他者のプライバシーを侵害する内容</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                  文字数について
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">推奨文字数</h3>
                    <p className="text-blue-700 dark:text-blue-300">
                      <strong>100文字以上 4,000文字以内</strong>で投稿してください。
                      10分程度で読める長さを目安にしています。
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">文字数制限の理由</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>短時間で読めるミステリーを提供するため</li>
                      <li>モバイルデバイスでの読みやすさを考慮</li>
                      <li>集中力を保ちながら楽しめる長さ</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Hash className="w-5 h-5 mr-2 text-indigo-500" />
                  タグの使い方
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">推奨タグ例</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">#推理小説</span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">#サスペンス</span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">#密室殺人</span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">#心理ミステリー</span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">#日常の謎</span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-sm rounded-full">#警察小説</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">タグのルール</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>作品の内容に関連するタグを付けてください</li>
                      <li>過度に多くのタグは避けてください（推奨：3-5個）</li>
                      <li>既存のタグを活用することをお勧めします</li>
                      <li>新しいタグを作る場合は、他のユーザーにも分かりやすいものにしてください</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  タイトルと内容について
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">タイトル</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>作品の内容を適切に表現するタイトルにしてください</li>
                      <li>過度に長いタイトルは避けてください</li>
                      <li>読者の興味を引く魅力的なタイトルを心がけてください</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">本文</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>読みやすい文章構成を心がけてください</li>
                      <li>適切な改行と段落分けを行ってください</li>
                      <li>誤字脱字がないか投稿前に確認してください</li>
                      <li>ミステリーとしての面白さを重視してください</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  コメントとフィードバック
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">建設的なコメントを</h3>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>作品の良い点を具体的に指摘してください</li>
                      <li>改善提案がある場合は丁寧に伝えてください</li>
                      <li>作者の努力を尊重してください</li>
                      <li>批判的な意見も建設的に表現してください</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">避けるべきコメント</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>個人的な攻撃や中傷</li>
                      <li>作品と関係のない内容</li>
                      <li>過度に否定的な表現</li>
                      <li>スパムや宣伝</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  著作権について
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">重要な注意事項</h3>
                    <ul className="list-disc list-inside space-y-1 text-orange-700 dark:text-orange-300">
                      <li>投稿する作品は必ずオリジナルであることを確認してください</li>
                      <li>既存の小説、映画、アニメなどの二次創作は禁止です</li>
                      <li>他者の作品を無断で使用することはできません</li>
                      <li>著作権侵害が発覚した場合、作品は削除されます</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  報告と削除について
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">不適切な内容の報告</h3>
                    <p className="mb-2">
                      ガイドラインに違反する作品やコメントを発見した場合は、
                      以下の方法で報告してください：
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>作品詳細画面の「報告」ボタンを使用</li>
                      <li>support@10minmystery.com までメールで連絡</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">削除基準</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>ガイドラインに明らかに違反する内容</li>
                      <li>複数のユーザーから報告された内容</li>
                      <li>法的な問題を含む内容</li>
                      <li>運営チームが不適切と判断した内容</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  お問い合わせ
                </h2>
                <p>
                  ガイドラインに関するご質問やご不明な点がございましたら、
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

export default PostingGuidelines;
