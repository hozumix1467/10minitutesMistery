import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  FileText,
  Settings,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { Novel } from '../types/Novel';
import { UserProfile } from '../types/User';
import { Draft } from '../types/Draft';
import { getUserProfile } from '../utils/userProfileService';
import { getUserNovels } from '../utils/novelService';
import { getUserDrafts } from '../utils/draftService';
import { getCurrentUser, signOutUser } from '../utils/authService';
import UserProfileForm from './UserProfileForm';

interface MyPageProps {
  novels: Novel[];
  onSelectNovel: (novel: Novel) => void;
  onEditNovel: (novel: Novel) => void;
  onDeleteNovel: (id: string) => void;
  onEditDraft?: (draft: Draft) => void;
  onDeleteDraft?: (id: string) => void;
  onBack: () => void;
  onViewChange: (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onCreateNovel: () => void;
}

const MyPage: React.FC<MyPageProps> = ({ 
  novels, 
  onSelectNovel, 
  onEditNovel, 
  onDeleteNovel, 
  onEditDraft,
  onDeleteDraft,
  onBack, 
  onViewChange,
  darkMode, 
  onToggleDarkMode, 
  onCreateNovel 
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'popular'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [userNovels, setUserNovels] = useState<Novel[]>([]);
  const [userDrafts, setUserDrafts] = useState<Draft[]>([]);
  const [activeTab, setActiveTab] = useState<'novels' | 'drafts'>('novels');
  
  // ユーザーの小説をFirebaseから取得
  useEffect(() => {
    const loadUserNovels = async () => {
      if (getCurrentUser()?.uid) {
        try {
          const firebaseNovels = await getUserNovels(getCurrentUser()!.uid);
          setUserNovels(firebaseNovels);
        } catch (error: any) {
          console.error('Firebaseでの小説取得に失敗:', error);
          // Firebaseが利用できない場合はローカルでフィルタリング
          const filteredNovels = novels.filter(novel => 
            novel.userId === getCurrentUser()?.uid || novel.author === '匿名ユーザー'
          );
          setUserNovels(filteredNovels);
        }
      }
    };
    
    loadUserNovels();
  }, [getCurrentUser()?.uid, novels]);

  // ユーザーの下書きを取得
  useEffect(() => {
    if (getCurrentUser()?.uid) {
      const drafts = getUserDrafts(getCurrentUser()!.uid);
      setUserDrafts(drafts);
    } else {
      setUserDrafts([]);
    }
  }, [getCurrentUser()?.uid]);

  // 作品数を計算
  const totalNovels = userNovels.length;
  
  // フィルタリングとソート
  const filteredNovels = userNovels
    .filter(novel => 
      novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      novel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (selectedFilter) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.characterCount - a.characterCount;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ユーザープロフィールを取得
  useEffect(() => {
    const loadUserProfile = async () => {
      const currentUser = getCurrentUser();
      if (currentUser?.uid) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
          // プロフィールが設定されていない場合のみフォームを表示
          if (!profile || !profile.displayName) {
            setShowProfileForm(true);
          }
        } catch (error: any) {
          console.error('プロフィール取得エラー:', error);
          // エラーの場合もフォームを表示
          setShowProfileForm(true);
        }
      } else {
        // ログインしていない場合もフォームを表示
        setShowProfileForm(true);
      }
    };

    loadUserProfile();
  }, []);

  const handleProfileSuccess = () => {
    setShowProfileForm(false);
    // プロフィール更新後に再取得
    const currentUser = getCurrentUser();
    if (currentUser?.uid) {
      getUserProfile(currentUser.uid).then(setUserProfile).catch(console.error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      onBack();
    } catch (error) {
      console.error('サインアウトエラー:', error);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('アカウントを削除しますか？この操作は取り消せません。')) {
      // TODO: アカウント削除機能を実装
      alert('アカウント削除機能は準備中です');
    }
  };



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
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
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
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-100 border-b-2 border-slate-100' : 'text-gray-900 border-b-2 border-gray-900'}`}
          >
            マイページ
          </button>
        </nav>
      </div>

      {/* ヘッダー */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 mb-4 flex items-center transition-colors"
        >
          ← 戻る
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                {userProfile?.displayName || 'ユーザー'}
              </h1>
              <p className="text-slate-400">
                {totalNovels}作品を投稿
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowProfileForm(true)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="プロフィール設定"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title={darkMode ? 'ライトモード' : 'ダークモード'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSignOut}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="サインアウト"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* プロフィール情報 */}
      {userProfile && (
        <div className="mb-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-100 mb-4">プロフィール情報</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-slate-400">表示名:</span>
                  <span className="ml-2 text-slate-100">{userProfile.displayName}</span>
                </div>
                <div>
                  <span className="text-slate-400">好きなジャンル:</span>
                  <span className="ml-2 text-slate-100">{userProfile.favoriteGenre}</span>
                </div>
                {userProfile.favoriteAuthor && (
                  <div>
                    <span className="text-slate-400">好きな作家:</span>
                    <span className="ml-2 text-slate-100">{userProfile.favoriteAuthor}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">自己紹介:</span>
                  <p className="mt-1 text-slate-100">{userProfile.bio || '未設定'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* タブ切り替え */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('novels')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'novels'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            投稿済み ({totalNovels})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            下書き ({userDrafts.length})
          </button>
        </div>
      </div>

      {/* 小説一覧 */}
      {activeTab === 'novels' && (
        <div>
          <div className="pb-6 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-slate-100">あなたの小説一覧</h2>
            
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* 検索バー */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="タイトルやタグで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20"
                  />
                  <BookOpen className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                </div>

                {/* フィルター */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedFilter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    すべて
                  </button>
                  <button
                    onClick={() => setSelectedFilter('recent')}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedFilter === 'recent'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    新着順
                  </button>
                  <button
                    onClick={() => setSelectedFilter('popular')}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedFilter === 'popular'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    文字数順
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredNovels.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNovels.map((novel) => (
                <div key={novel.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-slate-100 line-clamp-2">{novel.title}</h3>
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(novel.createdAt)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3 line-clamp-3">
                    {novel.content.substring(0, 100)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                    <span>{novel.characterCount.toLocaleString()}文字</span>
                    <span>{novel.likes?.length || 0}いいね</span>
                  </div>
                  
                  {novel.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {novel.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                      {novel.tags.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{novel.tags.length - 3}個
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-end space-x-2">
                    {/* アクションボタン */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectNovel(novel)}
                        className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-600 rounded-lg transition-colors"
                        title="詳細を見る"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditNovel(novel)}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-600 rounded-lg transition-colors"
                        title="編集する"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteNovel(novel.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-600 rounded-lg transition-colors"
                        title="削除する"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">小説がありません</h3>
              <p className="text-slate-500 mb-4">新しい小説を作成してみましょう</p>
              <button
                onClick={onCreateNovel}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                小説を作成
              </button>
            </div>
          )}
        </div>
      )}

      {/* 下書き一覧 */}
      {activeTab === 'drafts' && (
        <div>
          <div className="pb-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100">下書き一覧</h2>
          </div>
          
          {userDrafts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userDrafts.map((draft) => (
                <div key={draft.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-slate-100 line-clamp-2">{draft.title}</h3>
                    <div className="flex items-center space-x-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>下書き</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3 line-clamp-3">
                    {draft.content.substring(0, 100)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                    <span>{formatDate(draft.updatedAt)}</span>
                    <span>{draft.content.length}文字</span>
                  </div>
                  
                  {draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {draft.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                      {draft.tags.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{draft.tags.length - 3}個
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEditDraft?.(draft)}
                      className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => onDeleteDraft?.(draft.id)}
                      className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-300 mb-2">下書きがありません</h3>
              <p className="text-slate-500">新しい小説を作成して下書きを保存してみましょう</p>
            </div>
          )}
        </div>
      )}

      {/* ユーザープロフィール設定フォーム */}
      {showProfileForm && (
        <UserProfileForm
          uid={getCurrentUser()?.uid || ''}
          email={getCurrentUser()?.email || ''}
          existingProfile={userProfile}
          onClose={() => setShowProfileForm(false)}
          onSuccess={handleProfileSuccess}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default MyPage;