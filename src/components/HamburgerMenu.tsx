import React, { useState } from 'react';
import { Menu, X, Home, BookOpen, User, LogIn, PenTool, Sun, Moon } from 'lucide-react';
import { getCurrentUser } from '../utils/authService';

interface HamburgerMenuProps {
  currentView: 'home' | 'list' | 'create' | 'detail' | 'edit' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines';
  onViewChange: (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => void;
  onGetStarted: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  currentView, 
  onViewChange, 
  onGetStarted,
  darkMode,
  onToggleDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => {
    onViewChange(view);
    setIsOpen(false);
  };

  const handleGetStarted = () => {
    onGetStarted();
    setIsOpen(false);
  };

  const menuItems = [
    {
      id: 'home',
      label: 'ホーム',
      icon: Home,
      onClick: () => handleMenuClick('home')
    },
    {
      id: 'list',
      label: '作品一覧',
      icon: BookOpen,
      onClick: () => handleMenuClick('list')
    },
    {
      id: 'create',
      label: '小説を書く',
      icon: PenTool,
      onClick: handleGetStarted
    },
    ...(isLoggedIn ? [{
      id: 'myPage',
      label: 'マイページ',
      icon: User,
      onClick: () => handleMenuClick('myPage')
    }] : []),
    ...(!isLoggedIn ? [{
      id: 'login',
      label: 'ログイン',
      icon: LogIn,
      onClick: () => handleMenuClick('login')
    }] : [])
  ];

  return (
    <>
      {/* ハンバーガーボタン */}
      <div className="fixed top-4 right-4 z-[9999]">
        <button
          onClick={toggleMenu}
          className={`p-3 rounded-lg shadow-lg border transition-colors duration-200 ${
            darkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-600' 
              : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-300'
          }`}
          aria-label="メニューを開く"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* オーバーレイ */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* メニューパネル */}
      <div className={`fixed top-0 right-0 h-full w-80 shadow-xl transform transition-transform duration-300 ease-in-out z-[9999] ${
        darkMode ? 'bg-slate-800' : 'bg-white'
      } ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <img 
                src={darkMode ? '/images/icons/icon_dark.png' : '/images/icons/icon_light.png'}
                alt="10分事件簿" 
                className="w-6 h-6"
              />
              <h2 className={`text-xl font-bold ${darkMode ? 'text-slate-100' : 'text-gray-800'}`}>10分事件簿</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 transition-colors ${darkMode ? 'text-slate-400 hover:text-slate-100' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* メニュー項目 */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`w-full flex items-center space-x-4 px-6 py-4 text-left transition-colors duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : darkMode 
                          ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ダークモード切り替えボタン */}
          <div className="p-6 border-t border-slate-700">
            <button
              onClick={onToggleDarkMode}
              className={`w-full flex items-center space-x-4 px-6 py-4 text-left transition-colors duration-200 ${
                darkMode 
                  ? 'text-slate-300 hover:text-slate-100 hover:bg-slate-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">{darkMode ? 'ライトモード' : 'ダークモード'}</span>
            </button>
          </div>


        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
