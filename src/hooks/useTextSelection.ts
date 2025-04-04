import { useState, useEffect } from 'react';

interface TextSelectionState {
  selectedText: string;
  position: { x: number; y: number };
}

export const useTextSelection = () => {
  const [selectionState, setSelectionState] = useState<TextSelectionState>({
    selectedText: '',
    position: { x: 0, y: 0 },
  });

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || '';

      if (selectedText) {
        event.preventDefault();
        setSelectionState({
          selectedText,
          position: { x: event.clientX, y: event.clientY },
        });
      } else {
        setSelectionState({ selectedText: '', position: { x: 0, y: 0 } });
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const clearSelection = () => {
    setSelectionState({ selectedText: '', position: { x: 0, y: 0 } });
  };

  return { ...selectionState, clearSelection };
};
