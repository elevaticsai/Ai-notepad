import { ChevronLeft, Plus, FolderIcon, Trash2 } from "lucide-react";
import { Folder, Note } from "../../types";
import { useState } from "react";

interface FolderViewProps {
  folder: Folder;
  notes: Note[];
  onBack: () => void;
  onNewItemClick: (folderId: string) => void;
  onNoteClick: (note: Note) => void;
  onDeleteNote: (note: Note) => Promise<void>;
}

export const FolderView = ({
  folder,
  notes,
  onBack,
  onNewItemClick,
  onNoteClick,
  onDeleteNote,
}: FolderViewProps) => {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (note: Note) => {
    setNoteToDelete(note);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      setIsDeleting(true);
      await onDeleteNote(noteToDelete);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          <div
            className={`w-8 h-8 ${folder.color} rounded-lg mr-4 flex items-center justify-center`}
          >
            <FolderIcon size={16} />
          </div>
          <h1 className="text-2xl font-semibold flex-1">{folder.title}</h1>
          <button
            onClick={() => onNewItemClick(folder._id)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className={`${note.color} rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow relative group`}
            >
              <button
                className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note);
                }}
                title="Delete note"
              >
                <Trash2 size={18} />
              </button>
              <div onClick={() => onNoteClick(note)}>
                <h3 className="font-semibold mb-2">{note.title}</h3>
                <div className="text-sm text-gray-600 line-clamp-3">
                  {stripHtml(note.content)}
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              console.log('Creating note in folder:', folder._id);
              onNewItemClick(folder._id);
            }}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
          >
            <Plus size={32} className="mb-2" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete Note</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{noteToDelete.title}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setNoteToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
