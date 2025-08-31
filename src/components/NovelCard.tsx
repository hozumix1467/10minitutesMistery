import React from 'react';
import { Calendar, User, Hash, Heart } from 'lucide-react';
import { Novel } from '../types/Novel';
import { getCurrentUser } from '../utils/authService';

interface NovelCardProps {
  novel: Novel;
  onSelect: (novel: Novel) => void;
  onViewChange: (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => void;
  darkMode: boolean;
}

const NovelCard: React.FC<NovelCardProps> = ({ novel, onSelect, onViewChange, darkMode }) => {
  const likeCount = novel.likes?.length || 0;
  const commentCount = novel.comments?.length || 0;
  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleCardClick = () => {
    if (!isLoggedIn) {
      onViewChange('login');
      return;
    }
    onSelect(novel);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
          : 'bg-white border-gray-200 hover:border-purple-400'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-xl font-bold line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {novel.title}
        </h3>
        <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Hash className="w-4 h-4 mr-1" />
          {novel.characterCount.toLocaleString()}文字
        </div>
      </div>
      
      <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {novel.content.substring(0, 100)}...
      </p>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <User className="w-4 h-4 mr-2" />
          {novel.author}
        </div>
        <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(novel.createdAt)}
        </div>
      </div>

      {novel.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {novel.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${
                darkMode
                  ? 'bg-purple-900 text-purple-300'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              #{tag}
            </span>
          ))}
          {novel.tags.length > 3 && (
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              +{novel.tags.length - 3}個
            </span>
          )}
        </div>
      )}

      {/* いいね・コメント数表示 */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-600">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{likeCount}</span>
          </div>
          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">{commentCount}</span>
          </div>
        </div>
        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          読んでみる →
        </div>
      </div>
    </div>
  );
};

export default NovelCard;