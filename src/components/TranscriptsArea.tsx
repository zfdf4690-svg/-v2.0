import React, { useState, useEffect, useRef } from 'react';

interface Bullet {
  id: string;
  text: string;
  top: number;
  color: string;
}

export function TranscriptsArea({ isMicOn, onTranscript }: { isMicOn: boolean, onTranscript: (text: string) => void }) {
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMicOn) return;

    const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript);
        addBullet(transcript);
      }
    };

    recognition.start();
    return () => recognition.stop();
  }, [isMicOn]);

  const addBullet = (text: string) => {
    const newBullet: Bullet = {
      id: Date.now().toString(),
      text,
      top: Math.random() * 80,
      color: `hsl(${Math.random() * 360}, 70%, 70%)`
    };
    setBullets(prev => [...prev, newBullet]);
    setTimeout(() => {
      setBullets(prev => prev.filter(b => b.id !== newBullet.id));
    }, 5000);
  };

  return (
    <div className="relative w-full h-64 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden" ref={containerRef}>
      {bullets.map(bullet => (
        <div
          key={bullet.id}
          className="absolute whitespace-nowrap font-bold text-lg animate-bullet"
          style={{
            top: `${bullet.top}%`,
            color: bullet.color,
            animation: 'bullet-move 5s linear forwards'
          }}
        >
          {bullet.text}
        </div>
      ))}
      <style>{`
        @keyframes bullet-move {
          from { left: 100%; }
          to { left: -100%; }
        }
        .animate-bullet { animation: bullet-move 5s linear forwards; }
      `}</style>
    </div>
  );
}
