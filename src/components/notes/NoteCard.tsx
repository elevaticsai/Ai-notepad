import { Calendar, MoreHorizontal } from "lucide-react";
import { Note } from "../../types";
import { format } from "date-fns";
import { useDraggable } from "@dnd-kit/core";

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  draggable?: boolean;
}

export const NoteCard = ({ note, onClick, draggable = false }: NoteCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `note-${note._id}`,
    data: { noteId: note._id }
  });
  // Function to strip HTML tags and decode HTML entities
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const handleClick = () => {
    onClick(note);
  };

  return (
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
        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when clicking the menu button
        }}
      >
        <MoreHorizontal size={20} />
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
  );
};
