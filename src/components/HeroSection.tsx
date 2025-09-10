
import React, { useState, useEffect } from 'react';
import { BookOpen, PenTool, Calendar, Tag, Star, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Novel } from '../types/Novel';
import { getCurrentUser } from '../utils/authService';
import ImageSlider from './ImageSlider';

interface HeroSectionProps {
  onGetStarted: () => void;
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onViewChange: (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => void;
  darkMode: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, novels, onSelectNovel, onViewChange, darkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;

  // 最新の小説を取得
  const recentNovels = novels
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // 評価の高い小説（文字数が多い順）
  const topRatedNovels = novels
    .sort((a, b) => b.characterCount - a.characterCount)
    .slice(0, 6);



  // 利用可能なジャンルを取得
  const availableGenres = ['all', ...Array.from(new Set(novels.flatMap(novel => novel.tags)))];

  // 人気ジャンルを取得（作品数が多い順）
  const popularGenres = availableGenres
    .filter(genre => genre !== 'all')
    .map(genre => ({
      name: genre,
      count: novels.filter(novel => novel.tags.some(tag => tag.toLowerCase().includes(genre.toLowerCase()))).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  // 各ジャンルの作品を取得
  const getGenreNovels = (genreName: string) => {
    return novels.filter(novel => 
      novel.tags.some(tag => tag.toLowerCase().includes(genreName.toLowerCase()))
    ).slice(0, 7);
  };

  // スライダーの自動切り替え
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentNovels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [recentNovels.length]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNovelClick = (novel: Novel) => {
    if (!isLoggedIn) {
      onViewChange('login');
      return;
    }
    onSelectNovel(novel);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % recentNovels.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + recentNovels.length) % recentNovels.length);
  };

  return (
    <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} min-h-screen`}>
      {/* ヒーローセクション */}
      <section className="relative">
        {/* スローガンセクション（デスクトップのみ） */}
        <div className={`hidden md:block py-8 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <p className={`text-center text-lg ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>10分で読み終わるミステリー小説投稿サイト</p>
          </div>
        </div>

        {/* メインタイトルセクション */}
        <div className={`py-8 md:py-16 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <img
              src={darkMode ? '/images/icons/icon_dark.png' : '/images/icons/icon_light.png'}
              alt="10分事件簿"
              className="w-auto h-32 md:h-40 mx-auto object-contain"
            />
          </div>
        </div>

        {/* ナビゲーションメニューセクション */}
        <div className="py-8">
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
              <button 
                onClick={() => onViewChange('list')}
                className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
              >
                作品一覧
              </button>
              <button 
                onClick={onGetStarted}
                className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
              >
                小説を書く
              </button>
              {isLoggedIn && (
                <button 
                  onClick={() => onViewChange('myPage')}
                  className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  マイページ
                </button>
              )}
              {!isLoggedIn && (
                <button 
                  onClick={() => onViewChange('login')}
                  className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
                >
                  ログイン
                </button>
              )}
            </nav>
          </div>
        </div>

      </section>

      {/* 画像スライダーセクション（デスクトップのみ） */}
      <section className={`hidden md:block py-16 px-6 ${darkMode ? 'bg-slate-800/30' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <ImageSlider darkMode={darkMode} />
        </div>
      </section>

      {/* 新作スライダーセクション */}
      {recentNovels.length > 0 && (
        <section className="py-16 px-6 bg-slate-800/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img
                  src={darkMode ? '/images/title/newnovel_dark.png' : '/images/title/newnovel_light.png'}
                  alt="新作小説"
                  className="h-20 w-auto object-contain"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevSlide}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors border border-slate-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors border border-slate-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {recentNovels.map((novel) => (
                  <div key={novel.id} className="w-full flex-shrink-0">
                    <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700 shadow-sm">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-100 mb-4">{novel.title}</h3>
                          <p className="text-slate-300 mb-4 line-clamp-3">
                            {novel.content.substring(0, 200)}...
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-slate-400 mb-6">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(novel.createdAt)}</span>
                            </div>

                          </div>
                          <button
                            onClick={() => handleNovelClick(novel)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200"
                          >
                            読む
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* スライダーインジケーター */}
            <div className="flex justify-center space-x-2 mt-6">
              {recentNovels.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-indigo-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 評価の高い作品セクション */}
      {topRatedNovels.length > 0 && (
        <section className={`py-16 px-6 ${darkMode ? 'bg-slate-800/30' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img
                  src={darkMode ? '/images/title/Highlyratedworks_dark.png' : '/images/title/Highlyratedworks_light.png'}
                  alt="評価の高い作品"
                  className="h-20 w-auto object-contain"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRatedNovels.slice(0, 3).map((novel) => (
                <div key={novel.id} className={`rounded-xl p-6 border transition-colors cursor-pointer shadow-sm ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                     onClick={() => handleNovelClick(novel)}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className={`text-lg font-semibold line-clamp-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>{novel.title}</h3>
                    <div className="flex items-center space-x-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">高評価</span>
                    </div>
                  </div>
                  <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    {novel.content.substring(0, 100)}...
                  </p>
                  <div className={`flex items-center justify-between text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    <div className="flex items-center space-x-1">
                      <PenTool className="w-4 h-4" />
                      <span>{novel.characterCount.toLocaleString()}文字</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(novel.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 評価の高い作品を読むリンク */}
            <div className="text-center mt-8">
              <button
                onClick={() => onViewChange('list')}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white border border-slate-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300'
                }`}
              >
                <span>評価の高い作品を読む</span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 今週の作品セクション */}
      <section className={`py-16 px-6 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img
                src={darkMode ? '/images/title/thisweekwork_dark.png' : '/images/title/thisweekwork_light.png'}
                alt="今週の作品"
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>

          {/* 今週の特集作品 */}
          {recentNovels.length > 0 && (
            <div className="max-w-4xl mx-auto">
              {/* メイン画像 */}
              <div className="mb-8">
                <div className={`rounded-xl overflow-hidden shadow-lg border ${
                  darkMode ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <img
                    src="/images/topic/main.png"
                    alt="今週の特集作品"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              </div>

              {/* 作品紹介 */}
              <div className="mb-8">
                {/* 作品情報ヘッダー */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                      {recentNovels[0].title}
                    </h3>
                    <div className={`flex items-center space-x-4 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{recentNovels[0].author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(recentNovels[0].createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <PenTool className="w-4 h-4" />
                        <span>{recentNovels[0].characterCount.toLocaleString()}文字</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-400">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">今週の作品</span>
                  </div>
                </div>

                {/* 作品内容 */}
                <div className="mb-6">
                  <p className={`text-base leading-relaxed line-clamp-6 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {recentNovels[0].content}
                  </p>
                </div>

                {/* タグ */}
                {recentNovels[0].tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {recentNovels[0].tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          darkMode
                            ? 'bg-blue-900 text-blue-300'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 読むボタン */}
                <div className="text-center">
                  <button
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    onClick={() => handleNovelClick(recentNovels[0])}
                  >
                    この作品を読む
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ジャンル別表示セクション */}
      <section className="py-16 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img
                src={darkMode ? '/images/title/worksbygenre_dark.png' : '/images/title/worksbygenre_light.png'}
                alt="ジャンル別作品"
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>

          {/* 人気ジャンル別作品一覧 */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {popularGenres.map((genre) => {
                const genreNovels = getGenreNovels(genre.name);
                return (
                  <div key={genre.name} className="space-y-4">
                    {/* ジャンルタイトル */}
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                        #{genre.name}
                      </h3>
                      <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        {genre.count}作品
                      </span>
                    </div>

                    {/* 作品リスト */}
                    <div className="space-y-2">
                      {genreNovels.map((novel) => (
                        <div 
                          key={novel.id} 
                          className={`flex items-center cursor-pointer transition-colors ${
                            darkMode 
                              ? 'hover:text-slate-200' 
                              : 'hover:text-gray-700'
                          }`}
                          onClick={() => handleNovelClick(novel)}
                        >
                          <span className={`mr-3 text-lg ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>・</span>
                          <div className="flex-1">
                            <h4 className={`text-lg font-medium ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                              {novel.title}
                            </h4>
                          </div>
                          <div className="flex items-center space-x-2">
                            {novel.tags.slice(0, 2).map((tag, index) => (
                              <span 
                                key={index} 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  darkMode
                                    ? 'bg-purple-600/20 text-purple-300'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* このジャンルの別の作品を見るリンク */}
                    <div className="text-center pt-4">
                      <button
                        onClick={() => onViewChange('list')}
                        className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                          darkMode
                            ? 'text-slate-400 hover:text-slate-200'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <span>このジャンルの別の作品を見る</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {popularGenres.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">ジャンル別の作品はまだありません</p>
            </div>
          )}
        </div>
      </section>

      {/* アクションボタン */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
            >
              <PenTool className="w-5 h-5 inline mr-2" />
              小説を書いてみる
            </button>
            <div className="text-slate-400">または</div>
            <button 
              onClick={() => window.location.href = '/#/list'}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded-lg transition-colors duration-200 border border-slate-600 hover:border-slate-500"
            >
              <BookOpen className="w-5 h-5 inline mr-2" />
              すべての作品を見る
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
