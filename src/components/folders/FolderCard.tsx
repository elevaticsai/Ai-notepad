import { FileText, MoreHorizontal } from "lucide-react";
import { Folder } from "../../types";
import { format } from "date-fns";
import { useDroppable } from "@dnd-kit/core";

interface FolderCardProps {
  folder: Folder;
  noteCount: number;
  onClick: () => void;
}

export const FolderCard = ({ folder, noteCount, onClick }: FolderCardProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder._id}`,
    data: { folderId: folder._id }
  });
  return (
    <div
      ref={setNodeRef}
      data-folder-id={folder._id}
      className={`${folder.color} rounded-2xl p-6 relative group cursor-pointer transition-colors ${isOver ? 'ring-2 ring-blue-500 bg-opacity-90' : ''}`}
      onClick={onClick}
    >
      <button className="absolute right-4 top-4 opacity-0 group-hover:opacity-100">
        <MoreHorizontal size={20} />
      </button>
      <FileText className="mb-4" size={32} />
      <h3 className="font-medium line-clamp-1 overflow-hidden text-ellipsis mb-2">{folder.title}</h3>
      <p className="text-sm text-gray-600">{format(new Date(folder.createdAt), "MMM d, yyyy")}</p>
      <div className="mt-2 text-sm text-gray-500">
        {noteCount} notes
      </div>
    </div>
  );
};
