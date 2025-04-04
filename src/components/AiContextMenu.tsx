import React, { useState } from "react";
import {
  Bot,
  Sparkles,
  Wand2,
  Search as SearchIcon,
  MessageSquare,
  X,
} from "lucide-react";
import { getWritingPrompt, WritingPromptKey } from "../utils/prompts";
import { LLMClient } from "../services/llm-api-client";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { MdContentCopy, MdOutlineReplay } from "react-icons/md";

interface AiContextMenuProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
  editor: any;
}

export const AiContextMenu: React.FC<AiContextMenuProps> = ({
  selectedText,
  position,
  onClose,
  editor,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [lastAction, setLastAction] = useState<WritingPromptKey | null>(null);

  const removeMarkdownDelimiters = (text: string) => {
    // Remove ```markdown from the beginning
    text = text.replace(/^```markdown\s*/, "");
    // Remove ``` from the end
    text = text.replace(/```$/, "");
    return text.trim();
  };

  const formatResponse = async (text: string): Promise<string> => {
    const planeText = removeMarkdownDelimiters(text);
    const markedText: string = await marked.parse(planeText);
    return DOMPurify.sanitize(markedText);
  };

  const handleOptionClick = async (promptKey: WritingPromptKey) => {
    try {
      const { prompt, systemMessage } = getWritingPrompt(
        promptKey,
        selectedText
      );

      let response = "";
      const client = new LLMClient();

      for await (const chunk of client.streamResponse(prompt, systemMessage)) {
        response += chunk;
        const formattedResponse: string = await formatResponse(response);
        console.log("formated response is=>", formattedResponse);
        setAiResult(formattedResponse);
      }
    } catch (error) {
      console.error("Error details:", error);
    }
  };

  const handleAiAction = async (action: WritingPromptKey) => {
    setLoading(true);
    if (!selectedText) return;
    setLastAction(action);
    try {
      await handleOptionClick(action);
    } catch (error) {
      console.error("Error processing AI action:", error);
    } finally {
      setLoading(false);
    }
  };

  const insertResponse = () => {
    if (!editor || !aiResult) return;

    const contentContainer = document.getElementById("content-container");
    if (!contentContainer) return;

    editor
      .chain()
      .focus()
      .deleteSelection()
      .insertContent(contentContainer.innerHTML)
      .run();

    setAiResult("");
    onClose();
  };

  const handleCopy = () => {
    const contentContainer = document.getElementById("content-container");
    if (contentContainer) {
      const range = document.createRange();
      range.selectNode(contentContainer);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);

        try {
          const clipboardItem = new ClipboardItem({
            "text/html": new Blob([contentContainer.innerHTML], {
              type: "text/html",
            }),
            "text/plain": new Blob([contentContainer.innerText], {
              type: "text/plain",
            }),
          });
          navigator.clipboard.write([clipboardItem]).then(() => {
            selection.removeAllRanges();
          });
        } catch (err) {
          document.execCommand("copy");
          selection.removeAllRanges();
        }
      }
    }
  };

  const retryResponse = async () => {
    if (!lastAction || !selectedText) return;

    try {
      await handleOptionClick(lastAction);
    } catch (error) {
      console.error("Error retrying action:", error);
    }
  };

  const cancelResponse = () => {
    setAiResult("");
    onClose();
  };

  return (
    <>
      {/* AI Context Menu */}
      <div
        className="fixed bg-white bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl shadow-lg overflow-hidden border border-gray-100 z-50 w-45 p-1"
        style={{
          top: position.y,
          left: position.x,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-sm"
          onClick={() => handleAiAction("explain")}
        >
          <Wand2 size={16} className="text-amber-500" />
          <span>Elaborate</span>
        </button>
        <button
          className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-sm"
          onClick={() => handleAiAction("concise")}
        >
          <Bot size={16} className="text-blue-500" />
          <span>Summarize</span>
        </button>
        <button
          className="w-full px-4 py-2.5 text-left  flex items-center gap-2 text-sm"
          onClick={() => handleAiAction("improve")}
        >
          <Sparkles size={16} className="text-purple-500" />
          <span>Polish Writing</span>
        </button>

        <button
          className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-sm"
          onClick={() => handleAiAction("grammar")}
        >
          <SearchIcon size={16} className="text-green-500" />
          <span>Check Grammar</span>
        </button>
        <button
          className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-sm"
          onClick={() => handleAiAction("concise")}
        >
          <MessageSquare size={16} className="text-red-500" />
          <span>Make Concise</span>
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-900 border-t-transparent"></div>
            <span className="text-gray-900">Processing...</span>
          </div>
        </div>
      )}

      {/* AI Result Panel */}
      {aiResult && (
        <div
          id="ai-response-modal"
          className="fixed bg-gradient-to-br rounded-3xl from-indigo-50 via-purple-50 to-blue-50 bg-white shadow-lg overflow-hidden border border-gray-100 z-50 w-48"
          style={{
            top: position.y,
            left: position.x,
            zIndex: 100,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
            width: "650px",
            height: "300px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "15px" }}>
              AI Suggestion
            </span>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div
            id="content-container"
            style={{
              padding: "16px",
              fontSize: "14px",
              color: "dark:white",
            }}
            dangerouslySetInnerHTML={{ __html: aiResult }}
          />

          {/* Modal Footer */}
          <div className="flex justify-between items-center mt-10">
            <div className="flex space-x-3 mb-3">
              <button
                onClick={retryResponse}
                className="px-5 py-2 text-[#172b4d] hover:bg-gray-200 text-md"
              >
                <MdOutlineReplay size={20} />
              </button>
              <button
                onClick={handleCopy}
                className="px-1 py-1 text-[#172b4d] hover:bg-gray-200 text-md"
              >
                <MdContentCopy size={20} />
              </button>
            </div>
            <div className="flex space-x-3 mr-5 mb-3">
              <button
                onClick={cancelResponse}
                className="hover:bg-gray-200 text-md font-semibold text-[#192d4e] px-5 py-1 rounded-md"
              >
                Discard
              </button>
              <button
                onClick={insertResponse}
                className="bg-blue-600 text-md text-white font-semibold px-3 py-1 rounded-md border-4 border-white outline outline-3.5 outline-blue-500 shadow-md hover:bg-blue-800 transition duration-200"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
