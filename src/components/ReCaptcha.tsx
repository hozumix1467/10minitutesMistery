import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpired: () => void;
  onError: () => void;
}

export interface ReCaptchaRef {
  reset: () => void;
}

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
        }
      ) => number;
      reset: (widgetId: number) => void;
    };
    onRecaptchaLoad: () => void;
  }
}

const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(({ siteKey, onVerify, onExpired, onError }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    // reCAPTCHAスクリプトが読み込まれているかチェック
    if (window.grecaptcha) {
      renderRecaptcha();
    } else {
      // スクリプトが読み込まれていない場合、読み込み完了を待つ
      window.onRecaptchaLoad = renderRecaptcha;
    }

    return () => {
      // クリーンアップ
      if (widgetIdRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    };
  }, [siteKey]);

  const renderRecaptcha = () => {
    if (!containerRef.current || !window.grecaptcha) return;

    try {
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'expired-callback': onExpired,
        'error-callback': onError,
      });
    } catch (error) {
      console.error('reCAPTCHAの描画に失敗:', error);
    }
  };

  const resetRecaptcha = () => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  };

  // 外部からリセットできるように関数を公開
  useImperativeHandle(ref, () => ({
    reset: resetRecaptcha
  }));

  return (
    <div className="flex justify-center">
      <div ref={containerRef} className="transform scale-90" />
    </div>
  );
});

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;
