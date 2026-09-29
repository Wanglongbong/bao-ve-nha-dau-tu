import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SelectionAssistantProps {
  onAsk?: (selectedText: string) => void;
}

export function SelectionAssistant({ onAsk }: SelectionAssistantProps) {
  const [selection, setSelection] = useState('');

  useEffect(() => {
    const update = () => {
      const text = window.getSelection()?.toString().trim() ?? '';
      setSelection(text.length >= 20 && text.length <= 3000 ? text : '');
    };
    document.addEventListener('selectionchange', update);
    return () => document.removeEventListener('selectionchange', update);
  }, []);

  if (!selection) return null;

  return (
    <button
      type="button"
      className="selection-ask"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (onAsk) {
          onAsk(selection);
        } else {
          window.dispatchEvent(
            new CustomEvent('ck:ask-selection', { detail: selection })
          );
        }
        setSelection('');
      }}
    >
      <Sparkles className="w-4 h-4 text-amber-200" />
      <span>Hỏi trợ lý về đoạn đã chọn</span>
    </button>
  );
}

export default SelectionAssistant;
