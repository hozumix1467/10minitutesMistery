import React, { useState, useRef, useEffect } from 'react';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { signIn, signUp, signInWithGoogle } from '../utils/authService';
import { recaptchaConfig } from '../utils/firebase';
import ReCaptcha, { ReCaptchaRef } from './ReCaptcha';

interface LoginFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const recaptchaRef = useRef<ReCaptchaRef>(null);

  // コンポーネントマウント時にスクロール位置をトップにリセット
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // reCAPTCHAスクリプトを読み込み
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // reCAPTCHAの検証チェック
    if (!recaptchaVerified) {
      setError('reCAPTCHAの検証を完了してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // ログイン
        await signIn(email, password);
      } else {
        // サインアップ
        await signUp(email, password);
      }
      onSuccess();
    } catch (error: any) {
      console.error('認証エラー:', error);
      setError(getErrorMessage(error.code));
      // reCAPTCHAをリセット
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaVerified(false);
      setRecaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      onSuccess();
    } catch (error: any) {
      console.error('Googleログインエラー:', error);
      // 認証済みドメインエラーの場合は特別なメッセージを表示
      if (error.code === 'auth/unauthorized-domain') {
        setError('Googleログインは現在設定中です。メール/パスワードでログインしてください。');
      } else {
        setError(getErrorMessage(error.code));
      }
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'ユーザーが見つかりません';
      case 'auth/wrong-password':
        return 'パスワードが間違っています';
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません';
      case 'auth/weak-password':
        return 'パスワードが弱すぎます（6文字以上）';
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に使用されています';
      case 'auth/too-many-requests':
        return '試行回数が多すぎます。しばらく待ってから再試行してください';
      case 'auth/popup-closed-by-user':
        return 'ログインがキャンセルされました';
      case 'auth/popup-blocked':
        return 'ポップアップがブロックされました。ポップアップを許可してください';
      case 'auth/unauthorized-domain':
        return 'Googleログインは現在設定中です。メール/パスワードでログインしてください。';
      default:
        return '認証に失敗しました。もう一度お試しください';
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    // reCAPTCHAをリセット
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
    setRecaptchaVerified(false);
    setRecaptchaToken(null);
  };

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token);
    setRecaptchaVerified(true);
    setError('');
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaVerified(false);
    setRecaptchaToken(null);
  };

  const handleRecaptchaError = () => {
    setRecaptchaVerified(false);
    setRecaptchaToken(null);
    setError('reCAPTCHAの検証に失敗しました。もう一度お試しください');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* 戻るボタン */}
        <div className="mb-8">
          <button
            onClick={onClose}
            className="flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            ホームに戻る
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              {isLogin ? (
                <LogIn className="w-10 h-10 text-white" />
              ) : (
                <UserPlus className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-3">
              {isLogin ? 'ログイン' : 'アカウント作成'}
            </h1>
            <p className="text-slate-400">
              {isLogin ? 'アカウントにログインしてください' : '新しいアカウントを作成してください'}
            </p>
          </div>

          {/* Googleログインボタン */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed border border-gray-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Googleで{isLogin ? 'ログイン' : 'サインアップ'}
            </button>
          </div>

          {/* セパレーター */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">または</span>
            </div>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="パスワードを入力"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* reCAPTCHA */}
            <div>
              <ReCaptcha
                ref={recaptchaRef}
                siteKey={recaptchaConfig.siteKey}
                onVerify={handleRecaptchaVerify}
                onExpired={handleRecaptchaExpired}
                onError={handleRecaptchaError}
              />
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading || !recaptchaVerified}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  {isLogin ? 'ログイン中...' : '作成中...'}
                </div>
              ) : (
                isLogin ? 'ログイン' : 'アカウント作成'
              )}
            </button>
          </form>

          {/* モード切り替え */}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={toggleMode}
              className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors duration-200"
            >
              {isLogin ? 'アカウントをお持ちでない方はこちら' : '既にアカウントをお持ちの方はこちら'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
