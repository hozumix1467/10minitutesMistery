import { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import NovelList from './components/NovelList';
import NovelForm from './components/NovelForm';
import NovelDetail from './components/NovelDetail';
import MyPage from './components/MyPage';
import LoginForm from './components/LoginForm';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import PostingGuidelines from './components/PostingGuidelines';
import Footer from './components/Footer';
import HamburgerMenu from './components/HamburgerMenu';
import { Novel, NovelFormData, Comment } from './types/Novel';
import { Draft } from './types/Draft';
import { getAllNovels, createNovel, updateNovel, deleteNovel, toggleLike, addComment, migrateFromLocalStorage } from './utils/novelService';
import { deleteDraft } from './utils/draftService';
import { getCurrentUser } from './utils/authService';

type View = 'home' | 'list' | 'create' | 'detail' | 'edit' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines';

function App() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null);
  const [editingNovel, setEditingNovel] = useState<Novel | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // デフォルトをダークモードに変更
  });

  useEffect(() => {
    const loadNovels = async () => {
      try {
        // 初回起動時にローカルストレージからFirebaseに移行
        await migrateFromLocalStorage();
        
        // Firebaseから小説を取得
        const firebaseNovels = await getAllNovels();
        setNovels(firebaseNovels);
      } catch (error) {
        console.error('Firebaseからの小説読み込みに失敗:', error);
        
        // Firebaseが利用できない場合はローカルストレージから読み込み
        try {
          const { loadNovels: loadLocalNovels } = await import('./utils/localStorage');
          const localNovels = loadLocalNovels();
          console.log('ローカルストレージから小説を読み込み:', localNovels.length, '件');
          
          // ローカルストレージにデータがない場合はサンプルデータを追加
          if (localNovels.length === 0) {
            const { sampleNovels } = await import('./utils/sampleData');
            console.log('サンプルデータを追加:', sampleNovels.length, '件');
            setNovels(sampleNovels);
          } else {
            // 作者名を修正
            const correctedNovels = localNovels.map(novel => ({
              ...novel,
              author: novel.author === 'あなたの名前' ? '匿名ユーザー' : novel.author
            }));
            setNovels(correctedNovels);
          }
        } catch (localError) {
          console.error('ローカルストレージからの読み込みも失敗:', localError);
          // 最後の手段としてサンプルデータを表示
          const { sampleNovels } = await import('./utils/sampleData');
          setNovels(sampleNovels);
        }
      }
    };
    
    loadNovels();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSaveNovel = async (novelData: NovelFormData) => {
    console.log('handleSaveNovelが呼び出されました');
    console.log('受信したデータ:', novelData);
    
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?.uid || 'anonymous';

      if (editingNovel) {
        console.log('編集モード');
        const updatedNovel = await updateNovel(editingNovel.id, novelData);
        setNovels(prev => prev.map(n => n.id === editingNovel.id ? updatedNovel : n));
      } else {
        console.log('新規作成モード');
        // ユーザー名を作者名に設定
        const novelDataWithAuthor = {
          ...novelData,
          author: currentUser?.displayName || '匿名ユーザー'
        };
        const newNovel = await createNovel(novelDataWithAuthor, userId);
        setNovels(prev => [newNovel, ...prev]);
      }

      setEditingNovel(null);
      setCurrentView('list');
      console.log('保存完了、リスト画面に遷移');
    } catch (error) {
      console.error('Firebaseでの小説保存に失敗:', error);
      
      // Firebaseが利用できない場合はローカルストレージに保存
      try {
        const { saveNovel: saveLocalNovel } = await import('./utils/localStorage');
        const now = new Date();
        const currentUser = getCurrentUser();
        
        let novel: Novel;
        if (editingNovel) {
          novel = {
            ...editingNovel,
            ...novelData,
            characterCount: novelData.content.length,
            updatedAt: now,
          };
        } else {
          novel = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...novelData,
            author: currentUser?.displayName || '匿名ユーザー',
            characterCount: novelData.content.length,
            createdAt: now,
            updatedAt: now,
            userId: currentUser?.uid || 'anonymous',
            likes: [],
            comments: []
          };
        }
        
        saveLocalNovel(novel);
        setNovels(prev => editingNovel 
          ? prev.map(n => n.id === editingNovel.id ? novel : n)
          : [novel, ...prev]
        );
        
        setEditingNovel(null);
        setCurrentView('list');
        console.log('ローカルストレージに保存完了');
      } catch (localError) {
        console.error('ローカルストレージでの保存も失敗:', localError);
        alert('小説の保存に失敗しました。もう一度お試しください。');
      }
    }
  };

  const handleSelectNovel = (novel: Novel) => {
    setSelectedNovel(novel);
    setCurrentView('detail');
  };

  const handleEditNovel = (novel: Novel) => {
    setEditingNovel(novel);
    setCurrentView('edit');
  };

  const handleDeleteNovel = async (id: string) => {
    try {
      await deleteNovel(id);
      setNovels(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Firebaseでの小説削除に失敗:', error);
      
      // Firebaseが利用できない場合はローカルストレージから削除
      try {
        const { deleteNovel: deleteLocalNovel } = await import('./utils/localStorage');
        deleteLocalNovel(id);
        setNovels(prev => prev.filter(n => n.id !== id));
        console.log('ローカルストレージから削除完了');
      } catch (localError) {
        console.error('ローカルストレージでの削除も失敗:', localError);
        alert('小説の削除に失敗しました。もう一度お試しください。');
      }
    }
  };

  const handleLikeNovel = async (novelId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser?.uid) return;

    try {
      const updatedNovel = await toggleLike(novelId, currentUser.uid);
      setNovels(prev => prev.map(n => n.id === novelId ? updatedNovel : n));
    } catch (error) {
      console.error('Firebaseでのいいね更新に失敗:', error);
      
      // Firebaseが利用できない場合はローカルで更新
      try {
        const { saveNovel: saveLocalNovel } = await import('./utils/localStorage');
        const updatedNovels = novels.map(novel => {
          if (novel.id === novelId) {
            const likes = novel.likes || [];
            const isLiked = likes.includes(currentUser.uid);
            const updatedNovel = {
              ...novel,
              likes: isLiked 
                ? likes.filter(uid => uid !== currentUser.uid)
                : [...likes, currentUser.uid]
            };
            saveLocalNovel(updatedNovel);
            return updatedNovel;
          }
          return novel;
        });
        setNovels(updatedNovels);
        console.log('ローカルストレージでいいね更新完了');
      } catch (localError) {
        console.error('ローカルストレージでのいいね更新も失敗:', localError);
        alert('いいねの更新に失敗しました。もう一度お試しください。');
      }
    }
  };

  const handleCommentNovel = async (novelId: string, commentText: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser?.uid) return;

    try {
      const newComment: Comment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId: currentUser.uid,
        userName: currentUser.displayName || '匿名ユーザー',
        content: commentText,
        createdAt: new Date()
      };

      const updatedNovel = await addComment(novelId, newComment);
      setNovels(prev => prev.map(n => n.id === novelId ? updatedNovel : n));
      
      // 現在表示中の小説も更新
      if (selectedNovel && selectedNovel.id === novelId) {
        setSelectedNovel(updatedNovel);
      }
    } catch (error) {
      console.error('Firebaseでのコメント追加に失敗:', error);
      
      // Firebaseが利用できない場合はローカルで更新
      try {
        const { saveNovel: saveLocalNovel } = await import('./utils/localStorage');
        const newComment: Comment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: currentUser.uid,
          userName: currentUser.displayName || '匿名ユーザー',
          content: commentText,
          createdAt: new Date()
        };

        const updatedNovels = novels.map(novel => {
          if (novel.id === novelId) {
            const updatedNovel = {
              ...novel,
              comments: [...(novel.comments || []), newComment]
            };
            saveLocalNovel(updatedNovel);
            return updatedNovel;
          }
          return novel;
        });
        setNovels(updatedNovels);
        console.log('ローカルストレージでコメント追加完了');
      } catch (localError) {
        console.error('ローカルストレージでのコメント追加も失敗:', localError);
        alert('コメントの追加に失敗しました。もう一度お試しください。');
      }
    }
  };

  const handleEditDraft = (draft: Draft) => {
    // 下書きを編集フォームに読み込む
    setEditingNovel({
      id: draft.id,
      title: draft.title,
      content: draft.content,
      author: draft.author,
      tags: draft.tags,
      characterCount: draft.content.length,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
      userId: draft.userId,
      likes: [],
      comments: []
    });
    setCurrentView('edit');
  };

  const handleDeleteDraft = (id: string) => {
    if (window.confirm('この下書きを削除しますか？')) {
      deleteDraft(id);
    }
  };

  const handleViewChange = (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => {
    setCurrentView(view);
    if (view === 'list') {
      setSelectedNovel(null);
      setEditingNovel(null);
    }
    
    // ログイン画面に遷移する際はスクロール位置をトップにリセット
    if (view === 'login') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    setCurrentView('create');
  };

  const handleCreateNovel = () => {
    setEditingNovel(null);
    setCurrentView('create');
  };



  const handleLoginSuccess = () => {
    setCurrentView('home');
  };

  const handleLoginBack = () => {
    setCurrentView('home');
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
      {/* ハンバーガーメニュー */}
      <HamburgerMenu
        currentView={currentView}
        onViewChange={handleViewChange}
        onGetStarted={handleGetStarted}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {currentView === 'home' && (
        <HeroSection 
          onGetStarted={handleGetStarted} 
          novels={novels}
          onSelectNovel={handleSelectNovel}
          onViewChange={handleViewChange}
          darkMode={darkMode}
        />
      )}

      {currentView === 'list' && (
        <NovelList
          novels={novels}
          onSelectNovel={handleSelectNovel}
          onViewChange={handleViewChange}
          darkMode={darkMode}
        />
      )}

      {(currentView === 'create' || currentView === 'edit') && (
        <NovelForm
          onSave={handleSaveNovel}
          onDelete={handleDeleteNovel}
          editingNovel={editingNovel}
          onViewChange={handleViewChange}
          darkMode={darkMode}
        />
      )}

      {currentView === 'detail' && selectedNovel && (
        <NovelDetail
          novel={selectedNovel}
          onBack={() => setCurrentView('list')}
          onEdit={handleEditNovel}
          onDelete={handleDeleteNovel}
          onLike={handleLikeNovel}
          onComment={handleCommentNovel}
          onViewChange={handleViewChange}
          darkMode={darkMode}
        />
      )}

      {currentView === 'myPage' && (
        <MyPage
          novels={novels}
          onSelectNovel={handleSelectNovel}
          onEditNovel={handleEditNovel}
          onDeleteNovel={handleDeleteNovel}
          onEditDraft={handleEditDraft}
          onDeleteDraft={handleDeleteDraft}
          onBack={() => setCurrentView('list')}
          onViewChange={handleViewChange}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onCreateNovel={handleCreateNovel}
        />
      )}

      {currentView === 'login' && (
        <LoginForm
          onClose={handleLoginBack}
          onSuccess={handleLoginSuccess}
        />
      )}

      {currentView === 'privacy' && (
        <PrivacyPolicy
          onBack={() => setCurrentView('home')}
          darkMode={darkMode}
        />
      )}

      {currentView === 'terms' && (
        <TermsOfService
          onBack={() => setCurrentView('home')}
          darkMode={darkMode}
        />
      )}

      {currentView === 'guidelines' && (
        <PostingGuidelines
          onBack={() => setCurrentView('home')}
          darkMode={darkMode}
        />
      )}

      <Footer onViewChange={handleViewChange} darkMode={darkMode} />
    </div>
  );
}

export default App;