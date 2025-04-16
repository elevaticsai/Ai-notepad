import { Editor } from "@tiptap/react";
import { X } from "lucide-react";
import { EditorContent } from "@tiptap/react";
import { AiContextMenu } from "../AiContextMenu";
import { useTextSelection } from "../../hooks/useTextSelection";
import { EditorToolbar } from "../editor/EditorToolbar";
import { ColorOption } from "../../types";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onTitleChange: (title: string) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onSave: () => void;
  editor: Editor | null;
  isRecording: boolean;
  isReading: boolean;
  onToggleSpeechRecognition: () => void;
  onReadNote: () => void;
  colorOptions: ColorOption[];
}

export const NoteModal = ({
  isOpen,
  onClose,
  title,
  onTitleChange,
  selectedColor,
  onColorSelect,
  onSave,
  editor,
  isRecording,
  isReading,
  onToggleSpeechRecognition,
  onReadNote,
  colorOptions,
}: NoteModalProps) => {
  const { selectedText, position, clearSelection } = useTextSelection();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-white flex flex-col rounded-none shadow-none">
        {/* Modal Header */}
        <div className="border-b bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-50 border-gray-200 p-4 flex justify-between items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled"
            className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full"
          />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onColorSelect(color.value)}
                  className={`w-6 h-6 rounded-full ${color.value} ${
                    selectedColor === color.value
                      ? "ring-2 ring-offset-2 ring-blue-500"
                      : ""
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <EditorToolbar
          editor={editor}
          isRecording={isRecording}
          isReading={isReading}
          onToggleSpeechRecognition={onToggleSpeechRecognition}
          onReadNote={onReadNote}
        />

        {/* Editor Content */}
        <div
          onClick={clearSelection}
          className="flex-1 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 overflow-y-auto p-6"
        >
          <EditorContent editor={editor} className="prose max-w-none h-full" />
        </div>

        {/* AI Context Menu */}
        {selectedText && (
          <AiContextMenu
            selectedText={selectedText}
            position={position}
            onClose={clearSelection}
            editor={editor}
          />
        )}

        {/* Modal Footer */}
        <div className="border-t bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-200 border-gray-200 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">Press Ctrl + S to save</div>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};
