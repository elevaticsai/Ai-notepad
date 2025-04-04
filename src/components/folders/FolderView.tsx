import { ChevronLeft, FolderIcon, Plus } from "lucide-react";
import { Folder, Note } from "../../types";

interface FolderViewProps {
  folder: Folder;
  notes: Note[];
  onBack: () => void;
  onNewItemClick: (folderId: string) => void;
  onNoteClick: (note: Note) => void;
}

export const FolderView = ({
  folder,
  notes,
  onBack,
  onNewItemClick,
  onNoteClick,
}: FolderViewProps) => {
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
              onClick={() => onNoteClick(note)}
              className={`${note.color} rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow`}
            >
              <h3 className="font-semibold mb-2">{note.title}</h3>
              <div className="text-sm text-gray-600 line-clamp-3">
                {stripHtml(note.content)}
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
    </div>
  );
};
