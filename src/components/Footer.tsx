import React from 'react';
import { Github, Twitter, ExternalLink } from 'lucide-react';

interface FooterProps {
  onViewChange?: (view: 'home' | 'list' | 'create' | 'myPage' | 'login' | 'privacy' | 'terms' | 'guidelines') => void;
  darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ onViewChange, darkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* サイト情報 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={darkMode ? '/images/icons/icon_dark.png' : '/images/icons/icon_light.png'} 
                alt="10分事件簿" 
                className="w-24 h-10 md:w-40 md:h-16"
              />
            </div>
            <p className="text-slate-300 leading-relaxed">
              10分で読める魅力的なミステリー小説を、
              読む・書く・共有するためのプラットフォームです。
              短時間で楽しめる推理小説の世界をお楽しみください。
            </p>
          </div>

          {/* クイックリンク */}
          <div>
            <h4 className="text-lg font-semibold text-slate-100 mb-4">クイックリンク</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onViewChange?.('home')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ホーム
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onViewChange?.('list')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  作品一覧
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onViewChange?.('create')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  新規投稿
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onViewChange?.('myPage')}
                  className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  マイページ
                </button>
              </li>
            </ul>
          </div>

          {/* お問い合わせ・ソーシャル */}
          <div>
            <h4 className="text-lg font-semibold text-slate-100 mb-4">お問い合わせ</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfv-ejO9V4iwqC62ua7M8M_BsrsQbc5xmJJVrikiBla4VclEA/viewform?usp=header" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  お問い合わせフォーム
                </a>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold text-slate-100 mb-4 mt-6">ソーシャル</h4>
            <div className="flex space-x-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors duration-200 border border-slate-700"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-400 transition-colors duration-200 border border-slate-700"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* セパレーター */}
        <div className="border-t border-slate-700 mb-8"></div>

        {/* 下部情報 */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* 著作権 */}
          <div className="text-slate-400 text-sm">
            © {currentYear} 10分事件簿. All rights reserved.
          </div>

          {/* 法的リンク */}
          <div className="flex space-x-6 text-sm">
            <button 
              onClick={() => onViewChange?.('privacy')}
              className="text-slate-400 hover:text-indigo-400 transition-colors duration-200"
            >
              プライバシーポリシー
            </button>
            <button 
              onClick={() => onViewChange?.('terms')}
              className="text-slate-400 hover:text-indigo-400 transition-colors duration-200"
            >
              利用規約
            </button>
            <button 
              onClick={() => onViewChange?.('guidelines')}
              className="text-slate-400 hover:text-indigo-400 transition-colors duration-200"
            >
              投稿ガイドライン
            </button>
          </div>
        </div>

        {/* 技術情報 */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="text-center">
            <p className="text-slate-500 text-xs">
              Built with React, TypeScript, Tailwind CSS, and Firebase
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Hosted on Vercel | Database powered by Firestore
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
