import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";

export const useNoteEditor = (onSelectionUpdate?: (text: string) => void) => {
  return useEditor({
    extensions: [StarterKit, TextStyle, Color, Highlight, Image],
    content: "",
    onSelectionUpdate: ({ editor }) => {
      const selection = editor.state.selection;
      const text = editor.state.doc.textBetween(selection.from, selection.to);
      onSelectionUpdate?.(text);
    },
  });
};
