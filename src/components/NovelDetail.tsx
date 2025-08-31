import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, User, Hash, Edit, Trash2, Heart, MessageCircle, CheckCircle, X, Star, BookOpen, Award } from 'lucide-react';
import { Novel, Comment } from '../types/Novel';
import { getCurrentUser } from '../utils/authService';
import { getUserProfile } from '../utils/userProfileService';
import { UserProfile } from '../types/User';
import DeleteConfirmModal from './DeleteConfirmModal';

interface NovelDetailProps {
  novel: Novel;
  onBack: () => void;
  onEdit: (novel: Novel) => void;
  onDelete: (id: string) => void;
  onLike: (novelId: string) => void;
  onComment: (novelId: string, comment: string) => void;
  onViewChange: (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => void;
  darkMode: boolean;
}

const NovelDetail: React.FC<NovelDetailProps> = ({ 
  novel, 
  onBack, 
  onEdit, 
  onDelete, 
  onLike,
  onComment,
  onViewChange,
  darkMode 
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [hasReadToEnd, setHasReadToEnd] = useState(false);
  const [showInteractionButtons, setShowInteractionButtons] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<UserProfile | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  
  // 現在のユーザーがこの小説の所有者かどうかをチェック
  const isOwner = currentUser?.uid ? novel.userId === currentUser.uid : false;
  
  // デバッグ用ログ
  console.log('NovelDetail - isOwner check:', {
    currentUserId: currentUser?.uid,
    novelUserId: novel.userId,
    isOwner: isOwner
  });

  // 作者のプロフィール情報を取得
  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const profile = await getUserProfile(novel.userId);
        setAuthorProfile(profile);
      } catch (error) {
        console.error('作者プロフィールの取得に失敗:', error);
        setAuthorProfile(null);
      }
    };

    fetchAuthorProfile();
  }, [novel.userId]);
  
  // いいね・コメント関連
  const isLiked = currentUser?.uid ? novel.likes?.includes(currentUser.uid) : false;
  const likeCount = novel.likes?.length || 0;
  const commentCount = novel.comments?.length || 0;
  const isLoggedIn = !!currentUser;

  // スクロール監視機能
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const contentElement = contentRef.current;
      const scrollTop = contentElement.scrollTop;
      const scrollHeight = contentElement.scrollHeight;
      const clientHeight = contentElement.clientHeight;

      // 本文の最後まで読んだかどうかを判定（90%以上スクロール）
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      const hasReachedEnd = scrollPercentage >= 0.9;

      if (hasReachedEnd && !hasReadToEnd) {
        setHasReadToEnd(true);
        setShowInteractionButtons(true);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      // 初期チェック
      handleScroll();
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasReadToEnd]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(novel.id);
    onBack();
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      onViewChange('login');
      return;
    }
    onLike(novel.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onViewChange('login');
      return;
    }
    if (commentText.trim()) {
      console.log('コメント投稿:', { novelId: novel.id, commentText: commentText.trim() });
      onComment(novel.id, commentText.trim());
      setCommentText('');
      setShowCommentForm(false);
    }
  };

  const handleCommentClick = () => {
    if (!isLoggedIn) {
      onViewChange('login');
      return;
    }
    setShowCommentForm(!showCommentForm);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      {/* 戻るボタンとアクションボタン */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className={`flex items-center text-sm font-medium transition-colors duration-200 ${
            darkMode
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-purple-600 hover:text-purple-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          小説一覧に戻る
        </button>
        
        <div className="flex items-center space-x-2">
          {/* 読み終わり状態の表示 */}
          {hasReadToEnd && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">読み終わり</span>
            </div>
          )}

          {/* 所有者のみ編集・削除ボタンを表示 */}
          {isOwner && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onEdit(novel)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  darkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                }`}
                title="編集"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">編集</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 flex items-center space-x-2"
                title="削除"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">削除</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* タイトル */}
      <div className="mb-8">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {novel.title}
        </h1>
      </div>

      {/* あらすじ */}
      {novel.synopsis && (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            あらすじ
          </h3>
          <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {novel.synopsis}
          </p>
        </div>
      )}

      {/* タグ */}
      {novel.tags.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            タグ
          </h3>
          <div className="flex flex-wrap gap-2">
            {novel.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  darkMode
                    ? 'bg-purple-900 text-purple-300'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 本文 */}
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          本文
        </h3>
        <div 
          ref={contentRef}
          className={`w-full ${darkMode ? 'prose-invert' : ''}`}
        >
          <div className={`whitespace-pre-wrap leading-relaxed text-lg w-full ${
            darkMode ? 'text-gray-300' : 'text-gray-800'
          }`}>
            {novel.content}
          </div>
        </div>
      </div>

      {/* 読み終わり後のインタラクションボタン */}
      {showInteractionButtons && (
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                お疲れ様でした！
              </h3>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              この作品はいかがでしたか？感想をシェアしてください
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ${
                isLiked
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isLoggedIn ? "いいね" : "ログインが必要です"}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">
                {isLiked ? 'いいね済み' : 'いいね'} ({likeCount})
              </span>
            </button>
            
            <button
              onClick={handleCommentClick}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isLoggedIn ? "コメント" : "ログインが必要です"}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">
                コメント ({commentCount})
              </span>
            </button>
          </div>
        </div>
      )}

      {/* コメント投稿フォーム */}
      {showCommentForm && (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            コメントを投稿
          </h3>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="コメントを入力..."
              className={`w-full px-4 py-3 rounded-lg border resize-none ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCommentForm(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                投稿
              </button>
            </div>
          </form>
        </div>
      )}

      {/* コメント一覧 */}
      {novel.comments && novel.comments.length > 0 ? (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            コメント ({commentCount}件)
          </h3>
          <div className="space-y-4">
            {novel.comments.map((comment) => (
              <div key={comment.id} className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {comment.userName}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            コメント (0件)
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            まだコメントがありません。最初のコメントを投稿してみませんか？
          </p>
        </div>
      )}

      {/* 作者情報 */}
      <div 
        className={`p-6 rounded-lg cursor-pointer transition-colors duration-200 hover:opacity-80 ${
          darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        onClick={() => setShowAuthorModal(true)}
      >
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          作者情報
        </h3>
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-indigo-600' : 'bg-indigo-100'
          }`}>
            <User className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-indigo-600'}`} />
          </div>
          <div>
            <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {novel.author}
            </h4>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              クリックして詳細を見る
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="小説を削除"
        message="本当にこの小説を削除しますか？この操作は取り消すことができません。"
        darkMode={darkMode}
      />

      {/* Author Detail Modal */}
      {showAuthorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Header */}
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  作者情報
                </h2>
                <button
                  onClick={() => setShowAuthorModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>

            {/* Author Info */}
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-indigo-600' : 'bg-indigo-100'
                }`}>
                  <User className={`w-8 h-8 ${darkMode ? 'text-white' : 'text-indigo-600'}`} />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {authorProfile?.displayName || novel.author}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {authorProfile?.favoriteGenre ? `${authorProfile.favoriteGenre}作家` : '小説家'}
                  </p>
                </div>
              </div>

              {/* Author Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className={`w-5 h-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      作品数
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    1
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      総いいね数
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {likeCount}
                  </p>
                </div>
              </div>

              {/* Author Description */}
              <div className="mb-6">
                <h4 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  プロフィール
                </h4>
                {authorProfile?.bio ? (
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {authorProfile.bio}
                  </p>
                ) : (
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {novel.author}さんは、魅力的な物語を紡ぐ才能豊かな小説家です。
                    読者の心に響く作品を創作し続けています。
                  </p>
                )}
              </div>

              {/* Support Button */}
              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  darkMode
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                }`}
                onClick={() => {
                  // 応援機能の実装（将来的に拡張可能）
                  alert(`${novel.author}さんを応援しました！`);
                  setShowAuthorModal(false);
                }}
              >
                <Award className="w-5 h-5" />
                <span>この作者を応援する</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovelDetail;