import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, X, Tag, FileText, Trash2 } from 'lucide-react';
import { Novel, NovelFormData } from '../types/Novel';
import { getCurrentUser } from '../utils/authService';
import { createDraft } from '../utils/draftService';

// ジャンルのリストを定義
const GENRES = [
  'ミステリー',
  'サスペンス',
  '推理小説',
  '犯罪小説',
  '心理サスペンス',
  '法廷ミステリー',
  '警察小説',
  '探偵小説',
  'スリラー',
  'ホラー',
  'SF',
  'ファンタジー',
  '恋愛',
  '青春',
  '歴史',
  '現代',
  '未来',
  '過去',
  '異世界',
  '現実世界'
];

interface NovelFormProps {
  onSave: (novelData: NovelFormData) => void;
  onDelete?: (id: string) => void;
  editingNovel?: Novel | null;
  onViewChange: (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => void;
  darkMode: boolean;
}

const NovelForm: React.FC<NovelFormProps> = ({ onSave, onDelete, editingNovel, onViewChange, darkMode }) => {
  const [formData, setFormData] = useState<NovelFormData>({
    title: '',
    content: '',
    author: '',
    tags: [],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDraftSuccess, setShowDraftSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDraftSaveModal, setShowDraftSaveModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    if (editingNovel) {
      setFormData({
        title: editingNovel.title,
        content: editingNovel.content,
        author: editingNovel.author,
        tags: editingNovel.tags,
      });
    } else {
      // 新規作成時は現在のユーザー名を作者名に設定
      const currentUser = getCurrentUser();
      if (currentUser?.displayName) {
        setFormData(prev => ({
          ...prev,
          author: currentUser.displayName || '匿名ユーザー'
        }));
      }
    }
  }, [editingNovel]);

  const characterCount = formData.content.length;
  const isValidLength = characterCount >= 100 && characterCount <= 4000; // 4000文字程度の制限

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    console.log('バリデーション開始');
    console.log('タイトル:', formData.title);
    console.log('作者名:', formData.author);
    console.log('本文:', formData.content.substring(0, 50) + '...');

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルを入力してください';
      console.log('タイトルエラー');
    }
    if (!formData.author.trim()) {
      newErrors.author = '作者名を入力してください';
      console.log('作者名エラー');
    }
    if (!formData.content.trim()) {
      newErrors.content = '本文を入力してください';
      console.log('本文エラー（空）');
    } else if (characterCount < 100) {
      newErrors.content = `本文は100文字以上入力してください（現在: ${characterCount}文字）`;
      console.log('本文エラー（文字数不足）');
    } else if (characterCount > 4000) {
      newErrors.content = `本文は4000文字以内で入力してください（現在: ${characterCount}文字）`;
      console.log('本文エラー（文字数超過）');
    }

    console.log('バリデーション結果:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showErrorAlert = (errorMessages: string[]) => {
    const message = errorMessages.join('\n');
    alert(`入力エラーがあります:\n\n${message}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('フォーム送信が試行されました');
    console.log('現在のフォームデータ:', formData);
    console.log('文字数:', characterCount);
    console.log('有効な長さ:', isValidLength);
    
    if (validateForm()) {
      console.log('バリデーション成功、保存処理を実行');
      onSave(formData);
    } else {
      console.log('バリデーション失敗');
      const errorMessages = Object.values(errors).filter(error => error);
      if (errorMessages.length > 0) {
        showErrorAlert(errorMessages);
      }
    }
  };

  const handleSaveDraft = () => {
    const currentUser = getCurrentUser();
    if (!currentUser?.uid) {
      alert('下書きを保存するにはログインが必要です');
      return;
    }

    if (!formData.title.trim() && !formData.content.trim()) {
      alert('タイトルまたは内容を入力してください');
      return;
    }

    try {
      const draftData = {
        title: formData.title || '無題の下書き',
        content: formData.content,
        author: currentUser.displayName || '匿名ユーザー',
        tags: formData.tags,
      };

      createDraft(draftData, currentUser.uid);
      setShowDraftSuccess(true);
      setTimeout(() => setShowDraftSuccess(false), 3000);
    } catch (error) {
      console.error('下書きの保存に失敗:', error);
      alert('下書きの保存に失敗しました');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const addGenre = (genre: string) => {
    if (!formData.tags.includes(genre)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, genre],
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // ナビゲーション前の確認処理
  const handleNavigationClick = (view: string) => {
    // フォームに内容がある場合のみ確認モーダルを表示
    if (formData.title.trim() || formData.content.trim()) {
      setPendingNavigation(view);
      setShowDraftSaveModal(true);
    } else {
      onViewChange(view as any);
    }
  };

  // 下書き保存して移動
  const handleSaveDraftAndNavigate = async () => {
    try {
      handleSaveDraft();
      onViewChange(pendingNavigation as any);
    } catch (error) {
      console.error('下書き保存エラー:', error);
      alert('下書きの保存に失敗しました');
    }
    setShowDraftSaveModal(false);
    setPendingNavigation(null);
  };

  // 下書き保存せずに移動
  const handleNavigateWithoutSaving = () => {
    onViewChange(pendingNavigation as any);
    setShowDraftSaveModal(false);
    setPendingNavigation(null);
  };

  // モーダルをキャンセル
  const handleCancelNavigation = () => {
    setShowDraftSaveModal(false);
    setPendingNavigation(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 min-h-screen">
      {/* ヘッダーナビゲーション */}
      <div className="sticky top-0 z-40 bg-slate-900 py-4 mb-8">
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6">
          <button 
            onClick={() => handleNavigationClick('home')}
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
          >
            ホーム
          </button>
          <button 
            onClick={() => handleNavigationClick('list')}
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
          >
            作品一覧
          </button>
          <button 
            onClick={() => handleNavigationClick('create')}
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-100 border-b-2 border-slate-100' : 'text-gray-900 border-b-2 border-gray-900'}`}
          >
            小説を書く
          </button>
          <button 
            onClick={() => handleNavigationClick('myPage')}
            className={`text-lg font-medium transition-colors ${darkMode ? 'text-slate-300 hover:text-slate-100' : 'text-gray-700 hover:text-gray-900'}`}
          >
            マイページ
          </button>
        </nav>
      </div>

      <div className="rounded-xl p-8 bg-slate-800 shadow-2xl border border-slate-700">
        <h2 className="text-3xl font-bold mb-8 text-slate-100">
          {editingNovel ? '小説を編集' : '新しい小説を投稿'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                タイトル
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) {
                    setErrors({ ...errors, title: '' });
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-opacity-20 placeholder-slate-400 ${
                  errors.title 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="魅力的なタイトルを入力..."
              />
              {errors.title && (
                <p className="text-rose-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                作者名
              </label>
              <input
                type="text"
                value={formData.author}
                readOnly
                className="w-full px-4 py-3 rounded-lg border transition-colors duration-200 bg-slate-600 text-slate-300 border-slate-600 cursor-not-allowed"
                placeholder="ログインしてください..."
              />
              {errors.author && (
                <p className="text-rose-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.author}
                </p>
              )}
            </div>
          </div>



          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              ジャンル・タグ
            </label>
            
            {/* ジャンル選択 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-300">
                ジャンルを選択
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => addGenre(genre)}
                    disabled={formData.tags.includes(genre)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.tags.includes(genre)
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-slate-100 border border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <Tag className="w-4 h-4 inline mr-1" />
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* カスタムタグ */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-300">
                カスタムタグ
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-900 text-indigo-200 border border-indigo-700"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 bg-slate-700 border-slate-600 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 placeholder-slate-400"
                  placeholder="カスタムタグを入力してEnter..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 rounded-lg transition-colors duration-200 bg-indigo-700 hover:bg-indigo-600 text-indigo-100 hover:text-white border border-indigo-600 hover:border-indigo-500"
                >
                  追加
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">
                本文（100-4000文字）
              </label>
              <div className="flex items-center space-x-2">
                <div className={`text-sm ${
                  isValidLength 
                    ? 'text-emerald-400' 
                    : characterCount > 4000 
                      ? 'text-rose-400' 
                      : 'text-amber-400'
                }`}>
                  {characterCount.toLocaleString()} / 4,000文字
                </div>
                {isValidLength && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {(characterCount < 100 || characterCount > 4000) && (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                if (errors.content) {
                  setErrors({ ...errors, content: '' });
                }
              }}
              rows={20}
              className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 font-mono text-sm leading-relaxed bg-slate-700 text-slate-100 focus:ring-2 focus:ring-opacity-20 placeholder-slate-400 ${
                errors.content 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              placeholder="ここにあなたのミステリー小説を書いてください..."
            />
            {errors.content && (
              <p className="text-rose-400 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.content}
              </p>
            )}
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center bg-slate-600 hover:bg-slate-500 text-slate-200 hover:text-white border border-slate-500 hover:border-slate-400"
              >
                <FileText className="w-5 h-5 mr-2" />
                下書き保存
              </button>
              
              {/* 編集モードの場合のみ削除ボタンを表示 */}
              {editingNovel && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center bg-red-600 hover:bg-red-700 text-white border border-red-500 hover:border-red-400"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  削除
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {showDraftSuccess && (
                <div className="flex items-center text-emerald-400 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  下書きを保存しました
                </div>
              )}
              <button
                type="submit"
                disabled={!isValidLength}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  isValidLength
                    ? 'bg-indigo-700 hover:bg-indigo-600 text-indigo-100 hover:text-white hover:shadow-lg border border-indigo-600 hover:border-indigo-500'
                    : 'bg-slate-600 cursor-not-allowed text-slate-400'
                }`}
              >
                <Save className="w-5 h-5 mr-2" />
                {editingNovel ? '更新する' : '投稿する'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 削除確認モーダル */}
      {showDeleteModal && editingNovel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">小説を削除</h3>
            </div>
            
            <p className="text-slate-300 mb-6">
              「<span className="font-medium text-slate-100">{editingNovel.title}</span>」を本当に削除しますか？
              <br />
              <span className="text-sm text-slate-400">この操作は取り消すことができません。</span>
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  onDelete?.(editingNovel.id);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 下書き保存確認モーダル */}
      {showDraftSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">下書き保存の確認</h3>
            </div>
            
            <p className="text-slate-300 mb-6">
              この作品を下書き保存しますか？
              <br />
              <span className="text-sm text-slate-400">保存しない場合、入力内容は失われます。</span>
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelNavigation}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleNavigateWithoutSaving}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors"
              >
                保存しない
              </button>
              <button
                onClick={handleSaveDraftAndNavigate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                下書き保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovelForm;