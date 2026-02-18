'use client';

import { useEffect } from 'react';

export function VoiceflowChat() {
  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.defer = true;
      script.onload = function() {
        (window as any).voiceflow.chat.load({
          verify: { projectID: '68f77fad0591bc6ed924f99d' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          },
          launcher: {
            text: 'Chat with Katie'
          }
        });
      };
      script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs';
      document.body.appendChild(script);

      return script;
    };

    const timeoutId = setTimeout(() => {
      const script = loadScript();

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
