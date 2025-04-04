import { Calendar, Trash2 } from "lucide-react";
import { Note } from "../../types";
import { format } from "date-fns";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onDelete: (note: Note) => void;
  draggable?: boolean;
}

export const NoteCard = ({ note, onClick, onDelete, draggable = false }: NoteCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `note-${note._id}`,
    data: { noteId: note._id }
  });

  const handleClick = () => {
    onClick(note);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(note);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to strip HTML tags and decode HTML entities
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  return (
    <>
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={`${note.color} rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all relative group
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${draggable ? 'hover:scale-[1.02] active:scale-95' : ''}`}
      data-type="note"
      data-id={note._id}
      {...attributes}
      {...listeners}
    >
      <button 
        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-colors"
        onClick={handleDelete}
        title="Delete note"
      >
        <Trash2 size={18} />
      </button>
      <h3 className="font-semibold mb-2">{note.title}</h3>
      <div className="text-sm text-gray-600 line-clamp-2 overflow-hidden text-ellipsis">
        {stripHtml(note.content)}
      </div>
      <div className="flex items-center pt-5 text-sm text-gray-500">
        <Calendar size={14} className="mr-2" />
        <span>{format(new Date(note.createdAt), "MMM d, yyyy")}</span>
      </div>
    </div>
    {showDeleteModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
          <h3 className="text-lg font-semibold mb-2">Delete Note</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to delete "{note.title}"? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
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
    </>
  );
};
