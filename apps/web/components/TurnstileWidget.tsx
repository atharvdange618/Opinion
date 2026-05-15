'use client';

import { useEffect, useRef } from 'react';

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileWidgetProps {
  onExpire?: () => void;
  onVerify: (token: string) => void;
}

declare global {
  var turnstile:
    | {
        remove: (widgetId: string) => void;
        render: (
          container: HTMLElement | null,
          options: {
            callback: (token: string) => void;
            'expired-callback'?: () => void;
            sitekey: string;
            theme?: 'auto' | 'dark' | 'light';
          },
        ) => string;
        reset: (widgetId: string) => void;
      }
    | undefined;
}

export function TurnstileWidget({ onExpire, onVerify }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<null | string>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);

  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;

  useEffect(() => {
    void loadTurnstileScript().then(() => {
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (!siteKey || !containerRef.current || !globalThis.turnstile) return;
      if (widgetIdRef.current) return;

      widgetIdRef.current = globalThis.turnstile.render(containerRef.current, {
        callback: (token: string) => onVerifyRef.current(token),
        'expired-callback': () => onExpireRef.current?.(),
        sitekey: siteKey,
      });
    });

    return () => {
      if (widgetIdRef.current && globalThis.turnstile) {
        globalThis.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} />;
}

function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve) => {
    if (globalThis.turnstile) {
      resolve();
      return;
    }

    if (document.querySelector(`#${TURNSTILE_SCRIPT_ID}`)) {
      const check = setInterval(() => {
        if (globalThis.turnstile) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;

    const check = setInterval(() => {
      if (globalThis.turnstile) {
        clearInterval(check);
        resolve();
      }
    }, 50);

    setTimeout(() => {
      clearInterval(check);
      resolve();
    }, 10_000);

    document.head.append(script);
  });
}
