import React from 'react';
import { cleanAiText } from '@/lib/ai-client';

interface AiRichTextProps {
  text: string;
  streaming?: boolean;
  className?: string;
}

function InlineLinks({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return parts.map((part, index) => part.startsWith('http://') || part.startsWith('https://') ? (
    <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer" className="font-semibold text-orange-700 underline decoration-orange-300 underline-offset-2 break-all">
      {part}
    </a>
  ) : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>);
}

export function AiRichText({ text, streaming = false, className = '' }: AiRichTextProps) {
  const lines = cleanAiText(text).split('\n');
  return (
    <div className={`space-y-2 leading-relaxed ${className}`}>
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) return <div key={index} className="h-1" aria-hidden="true" />;
        const listMatch = line.match(/^(•|\d+[.)])\s+(.*)$/);
        if (listMatch) {
          return (
            <div key={index} className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 font-bold text-orange-600">{listMatch[1]}</span>
              <p className="min-w-0"><InlineLinks text={listMatch[2]} /></p>
            </div>
          );
        }
        const looksLikeHeading = line.endsWith(':') || (/^[A-ZÀ-Ỹ0-9\s–—/&(),.-]{8,}$/.test(line) && line.length < 100);
        return looksLikeHeading ? (
          <p key={index} className="pt-1 font-bold text-[#7C2D12]"><InlineLinks text={line.replace(/:$/, '')} /></p>
        ) : (
          <p key={index}><InlineLinks text={line} /></p>
        );
      })}
      {streaming && <span className="inline-block h-4 w-1 animate-pulse rounded-full bg-orange-500 align-middle" aria-label="AI đang viết" />}
    </div>
  );
}
