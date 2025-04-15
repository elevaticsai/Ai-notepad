import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format } from "date-fns";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Note, Folder, TimePeriod } from "../../types";
import { NoteCard } from "./NoteCard";
import { FolderCard } from "../folders/FolderCard";

interface HomePageProps {
  folders: Folder[];
  currentPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
  onFolderClick: (folder: Folder) => void;
  onNoteClick: (note: Note) => void;
  onNewItemClick: (folderId?: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
  sensors: any;
  getFolderNotes: (folderId: string) => Note[];
  getUnassignedNotes: () => Note[];
  notes: Note[];
  onDeleteNote: (note: Note) => Promise<void>;
  onDeleteFolder?: (folderId: string) => void;
}

export const HomePage = ({
  folders,
  // currentPeriod,
  // onPeriodChange,
  onFolderClick,
  onNoteClick,
  onNewItemClick,
  onDragEnd,
  sensors,
  getFolderNotes,
  getUnassignedNotes,
  // notes,
  onDeleteNote,
  onDeleteFolder,
}: HomePageProps) => {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="mb-12">
            <h2 className="text-2xl font-semibold pt-2 pb-10">
              Recent Folders
            </h2>
            {/* <div className="flex gap-4 mb-4">
              {["Todays", "This Week", "This Month"].map((period) => (
                <button
                  key={period}
                  className={`text-lg ${
                    currentPeriod === period
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-400"
                  }`}
                  onClick={() => onPeriodChange(period as TimePeriod)}
                >
                  {period}
                </button>
              ))}
            </div> */}
            <div className="mb-8 flex pt-5 items-center">
              <h1 className="text-2xl font-semibold flex-1">My Notes</h1>
              <button
                onClick={() => onNewItemClick()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {folders.map((folder) => (
                <div key={folder._id} className="flex-shrink-0">
                  <FolderCard
                    key={folder._id}
                    folder={folder}
                    noteCount={getFolderNotes(folder._id).length}
                    onClick={() => onFolderClick(folder)}
                    onDelete={onDeleteFolder}
                  />
                </div>
              ))}
              <button
                onClick={() => onNewItemClick()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
              >
                <Plus size={32} className="mb-2" />
                <span>New Folder</span>
              </button>
            </div>
          </div>
          <div className="flex  justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold pb-5">Unassigned Notes</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight size={20} />
              </button>
              <span className="text-gray-600 self-center">
                {format(new Date(), "MMMM yyyy")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {getUnassignedNotes().map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onClick={() => onNoteClick(note)}
                onDelete={() => onDeleteNote(note)}
                draggable
              />
            ))}
            <button
              onClick={() => onNewItemClick()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors"
            >
              <Plus size={32} className="mb-2" />
              <span>New Note</span>
            </button>
          </div>
        </DndContext>
      </div>
    </div>
  );
};
