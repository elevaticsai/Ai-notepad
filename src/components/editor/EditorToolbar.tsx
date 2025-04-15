import { Editor } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  Mic,
  Quote,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import ImageUploadModal from "./ImageUploadModal";

interface EditorToolbarProps {
  editor: Editor | null;
  isRecording: boolean;
  isReading: boolean;
  onToggleSpeechRecognition: () => void;
  onReadNote: () => void;
}

export const EditorToolbar = ({
  editor,
  isRecording,
  isReading,
  onToggleSpeechRecognition,
  onReadNote,
}: EditorToolbarProps) => {
  const [showImageModal, setShowImageModal] = useState(false);
  return (
    <div className="border-b bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50  border-gray-200 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`toolbar-button ${
              editor?.isActive("heading", { level: 1 }) ? "active" : ""
            }`}
          >
            <Heading1 size={18} />
          </button>
          <button
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`toolbar-button ${
              editor?.isActive("heading", { level: 2 }) ? "active" : ""
            }`}
          >
            <Heading2 size={18} />
          </button>
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`toolbar-button ${
              editor?.isActive("bold") ? "active" : ""
            }`}
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`toolbar-button ${
              editor?.isActive("italic") ? "active" : ""
            }`}
          >
            <Italic size={18} />
          </button>
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`toolbar-button ${
              editor?.isActive("bulletList") ? "active" : ""
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`toolbar-button ${
              editor?.isActive("blockquote") ? "active" : ""
            }`}
          >
            <Quote size={18} />
          </button>
          <div className="h-4 w-px bg-gray-200 mx-2" />
          <button
            onClick={() => setShowImageModal(true)}
            className="toolbar-button"
          >
            <ImageIcon size={18} />
          </button>
          <ImageUploadModal
            isOpen={showImageModal}
            onClose={() => setShowImageModal(false)}
            onImageSelect={(url) => {
              if (editor) {
                editor.chain().focus().setImage({ src: url }).run();
              }
              setShowImageModal(false);
            }}
          />
          <button
            onClick={() => {
              const url = window.prompt("Enter link URL");
              if (url && editor) {
                //@ts-ignore
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`toolbar-button ${
              editor?.isActive("link") ? "active" : ""
            }`}
          >
            <LinkIcon size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSpeechRecognition}
            className={`toolbar-button ${
              isRecording ? "bg-red-50 text-red-600" : ""
            }`}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            <Mic size={18} />
          </button>
          <button
            onClick={onReadNote}
            className={`toolbar-button ${
              isReading ? "bg-blue-50 text-blue-600" : ""
            }`}
            title={isReading ? "Stop reading" : "Read note"}
          >
            <Volume2 size={18} />
          </button>
          <select
            onChange={(e) =>
              editor?.chain().focus().setColor(e.target.value).run()
            }
            className="toolbar-button bg-transparent"
          >
            <option value="inherit">Default</option>
            <option value="#000000">Black</option>
            <option value="#2563eb">Blue</option>
            <option value="#16a34a">Green</option>
            <option value="#dc2626">Red</option>
          </select>
        </div>
      </div>
    </div>
  );
};
