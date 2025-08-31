import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Tag, Star, Calendar, Hash } from 'lucide-react';
import { Novel } from '../types/Novel';

interface NovelListProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onViewChange: (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => void;
  darkMode: boolean;
}

const NovelList: React.FC<NovelListProps> = ({ novels, onSelectNovel, onViewChange, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'rating' | 'characters'>('newest');

  // 利用可能なジャンルを取得
  const availableGenres = useMemo(() => {
    const genres = new Set<string>();
    novels.forEach(novel => {
      novel.tags.forEach(tag => genres.add(tag));
    });
    return ['all', ...Array.from(genres).sort()];
  }, [novels]);

  // フィルタリングとソート
  const filteredAndSortedNovels = useMemo(() => {
    let filtered = novels.filter(novel => {
      // 検索条件
      const matchesSearch = !searchTerm || 
        novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        novel.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        novel.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        novel.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // ジャンル条件
      const matchesGenre = selectedGenre === 'all' || 
        novel.tags.some(tag => tag.toLowerCase() === selectedGenre.toLowerCase());

      return matchesSearch && matchesGenre;
    });

    // ソート
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          // 文字数が多い順（高評価として扱う）
          return b.characterCount - a.characterCount;
        case 'characters':
          return b.characterCount - a.characterCount;
        default:
          return 0;
      }
    });
  }, [novels, searchTerm, selectedGenre, sortBy]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-900 min-h-screen">
      {/* ヘッダーナビゲーション */}
      <div className="sticky top-0 z-40 bg-slate-900 py-4 mb-8">
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6">
          <button 
            onClick={() => onViewChange('home')}
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
          >
            ホーム
          </button>
          <button 
            onClick={() => onViewChange('list')}
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-100 border-b-2 border-slate-100' : 'text-gray-900 border-b-2 border-gray-900'}`}
          >
            作品一覧
          </button>
          <button 
            onClick={() => onViewChange('create')}
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
          >
            小説を書く
          </button>
          <button 
            onClick={() => onViewChange('myPage')}
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
          >
            マイページ
          </button>
        </nav>
      </div>

      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">作品一覧</h1>
        <p className="text-slate-400">投稿されたミステリー小説をお楽しみください</p>
      </div>

      {/* 検索・フィルター・ソート */}
      <div className="mb-8 space-y-6">
        {/* 検索バー */}
        <div className="p-6 rounded-xl bg-slate-800 shadow-2xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-slate-100">作品を検索</h3>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="タイトル、作者名、内容、タグで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // 検索実行（既にリアルタイムで検索されているため、特に処理は不要）
                  }
                }}
                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 bg-slate-700 border-slate-600 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 placeholder-slate-400"
              />
            </div>
            <button
              onClick={() => {
                // 検索実行（既にリアルタイムで検索されているため、特に処理は不要）
                // 必要に応じて検索結果にフォーカスを当てるなどの処理を追加可能
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              検索
            </button>
          </div>
        </div>

        {/* フィルターとソート */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ジャンルフィルター */}
          <div className="p-6 rounded-xl bg-slate-800 shadow-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-slate-100">ジャンルで絞り込み</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableGenres.slice(0, 10).map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenre === genre
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {genre === 'all' ? 'すべて' : `#${genre}`}
                </button>
              ))}
              {availableGenres.length > 10 && (
                <span className="px-4 py-2 text-slate-400 text-sm">
                  +{availableGenres.length - 10}個
                </span>
              )}
            </div>
          </div>

          {/* ソート */}
          <div className="p-6 rounded-xl bg-slate-800 shadow-2xl border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-100">並び順</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSortBy('newest')}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  sortBy === 'newest'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                新作順
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  sortBy === 'rating'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Star className="w-4 h-4" />
                高評価
              </button>
              <button
                onClick={() => setSortBy('characters')}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  sortBy === 'characters'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Hash className="w-4 h-4" />
                文字数順
              </button>
              <button
                onClick={() => setSortBy('title')}
                className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  sortBy === 'title'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                タイトル順
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <span className="font-semibold">
              {filteredAndSortedNovels.length}件の作品が見つかりました
            </span>
            {searchTerm && (
              <span className="text-indigo-400">
                「{searchTerm}」で検索
              </span>
            )}
            {selectedGenre !== 'all' && (
              <span className="text-purple-400">
                ジャンル: #{selectedGenre}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500">
            全{novels.length}件中
          </div>
        </div>
      </div>

      {/* Novel List */}
      {filteredAndSortedNovels.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedNovels.map(novel => (
            <div
              key={novel.id}
              className={`p-6 rounded-xl border transition-colors cursor-pointer hover:shadow-lg ${
                darkMode 
                  ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectNovel(novel)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                    {novel.title}
                  </h3>
                  <div className={`flex items-center space-x-4 text-sm ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">{novel.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(novel.createdAt).toLocaleDateString('ja-JP')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Hash className="w-4 h-4" />
                      <span>{novel.characterCount.toLocaleString()}文字</span>
                    </div>
                  </div>
                </div>
                {novel.characterCount > 5000 && (
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">高評価</span>
                  </div>
                )}
              </div>

              <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {novel.content.substring(0, 200)}...
              </p>

              {novel.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {novel.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode
                          ? 'bg-purple-900 text-purple-300'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <h3 className="text-xl font-semibold mb-2 text-slate-300">
            {searchTerm ? '該当する作品が見つかりませんでした' : '投稿された作品がありません'}
          </h3>
          <p className="text-slate-400">
            {searchTerm ? '別のキーワードで検索してみてください' : '最初の作品を投稿してみましょう'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NovelList;