import { FileText, Trash2 } from "lucide-react";
import { Folder } from "../../types";
import { format } from "date-fns";
import { useState } from "react";
import { folderService } from "../../services/folderService";
import { useDroppable } from "@dnd-kit/core";

interface FolderCardProps {
  folder: Folder;
  noteCount: number;
  onClick: () => void;
  onDelete?: (folderId: string) => void;
}

export const FolderCard = ({ folder, onClick, noteCount, onDelete }: FolderCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder._id}`,
    data: { folderId: folder._id }
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await folderService.deleteFolder(folder._id);
      setShowDeleteModal(false);
      // Notify parent component about the deletion
      onDelete?.(folder._id);
    } catch (error) {
      console.error('Error deleting folder:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        data-folder-id={folder._id}
        className={`${folder.color} rounded-2xl p-6 relative group cursor-pointer transition-colors ${isOver ? 'ring-2 ring-blue-500 bg-opacity-90' : ''}`}
        onClick={onClick}
      >
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-black/10 rounded-full"
        >
          <Trash2 size={20} className="text-gray-700" />
        </button>
        <FileText className="mb-4" size={32} />
        <h3 className="font-medium line-clamp-1 overflow-hidden text-ellipsis mb-2">{folder.title}</h3>
        <p className="text-sm text-gray-600">{format(new Date(folder.createdAt), "MMM d, yyyy")}</p>
        <div className="mt-2 text-sm text-gray-500">
          {noteCount} notes
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete Folder</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{folder.title}"? This action cannot be undone.</p>
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
