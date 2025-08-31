import React, { useState, useEffect } from 'react';
import { User, BookOpen, Save, X, Trash2 } from 'lucide-react';
import { UserProfile, UserProfileFormData, GENRES } from '../types/User';
import { upsertUserProfile } from '../utils/userProfileService';

interface UserProfileFormProps {
  uid: string;
  email: string;
  existingProfile?: UserProfile | null;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
  onDeleteAccount?: () => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ 
  uid, 
  email, 
  existingProfile,
  onClose, 
  onSuccess,
  onDeleteAccount
}) => {
  const [formData, setFormData] = useState<UserProfileFormData>({
    displayName: '',
    favoriteGenre: '推理小説',
    bio: '',
    favoriteAuthor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 既存のプロフィール情報を初期値として設定
  useEffect(() => {
    if (existingProfile) {
      setFormData({
        displayName: existingProfile.displayName || '',
        favoriteGenre: existingProfile.favoriteGenre || '推理小説',
        bio: existingProfile.bio || '',
        favoriteAuthor: existingProfile.favoriteAuthor || ''
      });
    }
  }, [existingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('保存するプロフィールデータ:', formData);
      const profile = await upsertUserProfile(uid, email, formData);
      console.log('保存後のプロフィール:', profile);
      onSuccess(profile);
    } catch (error: any) {
      console.error('プロフィール保存エラー:', error);
      setError('プロフィールの保存に失敗しました。もう一度お試しください');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* ヘッダー */}
        <div className="relative mb-4">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              プロフィール設定
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              ユーザー名と好きなジャンルを設定してください
            </p>
          </div>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ユーザー名 */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
              ユーザー名 <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="ユーザー名を入力"
                required
                maxLength={20}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              最大20文字まで
            </p>
          </div>

          {/* 好きなジャンル */}
          <div>
            <label htmlFor="favoriteGenre" className="block text-sm font-medium text-slate-300 mb-2">
              好きなジャンル
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                id="favoriteGenre"
                value={formData.favoriteGenre}
                onChange={(e) => handleInputChange('favoriteGenre', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {GENRES.map((genre) => (
                  <option key={genre} value={genre} className="bg-slate-700 text-slate-100">
                    {genre}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 好きな作家 */}
          <div>
            <label htmlFor="favoriteAuthor" className="block text-sm font-medium text-slate-300 mb-2">
              好きな作家
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                id="favoriteAuthor"
                value={formData.favoriteAuthor || ''}
                onChange={(e) => handleInputChange('favoriteAuthor', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="好きな作家を入力（任意）"
                maxLength={50}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              最大50文字まで
            </p>
          </div>

          {/* 自己紹介 */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
              自己紹介
            </label>
            <textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="自己紹介を入力（任意）"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-slate-500 mt-1">
              最大200文字まで
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-colors duration-200 border border-slate-600 hover:border-slate-500 flex items-center justify-center"
            >
              <X className="w-5 h-5 mr-2" />
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading || !formData.displayName.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  保存
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* アカウント削除セクション */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <h3 className="text-base font-semibold text-slate-100 mb-3">危険な操作</h3>
          <p className="text-slate-400 text-sm mb-3">
            アカウントを削除すると、すべてのデータが永久に失われます。この操作は取り消すことができません。
          </p>
          <button
            onClick={() => {
              if (window.confirm('アカウントを削除しますか？この操作は取り消せません。')) {
                onDeleteAccount?.();
              }
            }}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            アカウントを削除
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
