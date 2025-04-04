import { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { HomePage } from "./components/notes/HomePage";
import { FolderView } from "./components/folders/FolderView";
import { NewItemModal } from "./components/modals/NewItemModal";
import { NoteModal } from "./components/modals/NoteModal";
import { Note, Folder, ViewType, TimePeriod, NewItemType } from "./types";
import { useNoteEditor } from "./hooks/useNoteEditor";
import {
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { colorOptions } from "./utils/constants";
import { noteService } from "./services/noteService";
import { folderService } from "./services/folderService";

const MainApp = () => {
  const [view, setView] = useState<ViewType>("home");
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<TimePeriod>("Todays");
  const [newItemType, setNewItemType] = useState<NewItemType>(null);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await noteService.getAllNotes();
        setNotes(fetchedNotes);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch notes:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          setError("Failed to fetch notes. Please try again.");
        }
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const fetchedFolders = await folderService.getAllFolders();
        setFolders(fetchedFolders as unknown as Folder[]);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch folders:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          setError("Failed to fetch folders. Please try again.");
        }
      }
    };
    fetchFolders();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Extract IDs from the draggable/droppable elements
    const noteId = active.id.toString().replace('note-', '');
    const folderId = over.id.toString().replace('folder-', '');

    if (noteId && folderId) {
      try {
        // Update the note in the backend
        const updatedNote = await noteService.updateNote(noteId, { folderId });
        
        // Update local state
        setNotes(notes.map((note) =>
          note._id === noteId ? updatedNote : note
        ));
      } catch (err) {
        console.error('Failed to update note folder:', err);
        setError('Failed to move note to folder. Please try again.');
      }
    }
  };

  const getFolderNotes = (folderId: string) => {
    return notes.filter((note) => note.folderId === folderId);
  };

  const getUnassignedNotes = () => {
    return notes.filter((note) => !note.folderId);
  };

  const handleFolderClick = (folder: Folder) => {
    setSelectedFolder(folder);
    setView("folder");
  };

  const editor = useNoteEditor();

  const handleCloseModals = () => {
    setShowNoteModal(false);
    setShowNewItemModal(false);
    setNewItemType(null);
    setNewItemTitle("");
    setNewNoteTitle("");
    setSelectedColor(colorOptions[0].value);
    setSelectedNote(null);
    editor?.commands.clearContent();
  };

  const handleNewItemClick = (folderId?: string) => {
    setShowNewItemModal(true);
    setNewItemType(null);
    setNewItemTitle("");
    setSelectedColor(colorOptions[0].value);

    if (view === "folder" && selectedFolder) {
      return;
    }

    if (folderId) {
      const folder = folders.find((f) => f._id === folderId);
      if (folder) {
        setSelectedFolder(folder);
      }
    } else {
      setSelectedFolder(null);
    }
  };

  const handleItemTypeSelect = (type: "note" | "folder") => {
    setNewItemType(type);
    if (type === "note") {
      setShowNoteModal(true);
      setShowNewItemModal(false);
    }
  };

  const createNewFolder = async () => {
    if (newItemTitle.trim()) {
      try {
        const folderData = {
          title: newItemTitle,
          color: selectedColor,
          parentFolderId: null,
          isDeleted: false,
        };

        const createdFolder = await folderService.createFolder(folderData);
        setFolders([createdFolder as unknown as Folder, ...folders]);
        handleCloseModals();
        setNewItemTitle("");
        setSelectedColor(colorOptions[0].value);
      } catch (err) {
        console.error("Failed to create folder:", err);
        setError("Failed to create folder. Please try again.");
      }
    }
  };

  const handleSaveNote = async () => {
    try {
      const noteData = {
        title: newNoteTitle,
        content: editor?.getHTML() || "",
        color: selectedColor,
        folderId: selectedFolder?._id || null,
        tags: selectedNote?.tags || [],
        isArchived: selectedNote?.isArchived || false,
        isDeleted: selectedNote?.isDeleted || false,
      };

      if (selectedNote) {
        const updatedNote = await noteService.updateNote(
          selectedNote._id,
          noteData
        );
        setNotes(
          notes.map((note) =>
            note._id === selectedNote._id ? updatedNote : note
          )
        );
      } else {
        const newNote = await noteService.createNote(noteData);
        setNotes([...notes, newNote]);
      }

      handleCloseModals();
    } catch (err) {
      console.error("Failed to save note:", err);
      setError("Failed to save note. Please try again.");
    }
  };

  const handleToggleSpeechRecognition = () => {
    if (!isRecording) {
      if (
        "SpeechRecognition" in window ||
        "webkitSpeechRecognition" in window
      ) {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: {
          results: { transcript: string }[][];
        }) => {
          const transcript = event.results[0][0].transcript;
          if (editor) {
            editor.commands.insertContent(transcript);
          }
        };

        recognition.onerror = (event: { error: string }) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognition.start();
        setIsRecording(true);

        recognition.onend = () => {
          setIsRecording(false);
        };
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleReadNote = () => {
    if (!isReading && editor) {
      const text = editor.getText();
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.onend = () => {
        setIsReading(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setIsReading(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    } else {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setNewNoteTitle(note.title);
    setSelectedColor(note.color);
    editor?.commands.setContent(note.content);
    setShowNoteModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 flex">
      {error ? (
        <div className="flex items-center justify-center w-full">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      ) : (
        <>
          <Sidebar onNewItem={handleNewItemClick} />
          <div className="flex-1">
            {view === "home" ? (
              <HomePage
                folders={folders}
                currentPeriod={currentPeriod}
                onPeriodChange={setCurrentPeriod}
                onFolderClick={handleFolderClick}
                onNoteClick={handleNoteClick}
                onNewItemClick={handleNewItemClick}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                getFolderNotes={getFolderNotes}
                getUnassignedNotes={getUnassignedNotes}
              />
            ) : view === "folder" && selectedFolder ? (
              <FolderView
                folder={selectedFolder}
                notes={getFolderNotes(selectedFolder._id)}
                onBack={() => {
                  setSelectedFolder(null);
                  setView("home");
                }}
                onNewItemClick={handleNewItemClick}
                onNoteClick={handleNoteClick}
              />
            ) : null}
          </div>
          {showNewItemModal && (
            <NewItemModal
              isOpen={showNewItemModal}
              onClose={handleCloseModals}
              onItemTypeSelect={handleItemTypeSelect}
              itemType={newItemType}
              title={newItemTitle}
              onTitleChange={setNewItemTitle}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              onSubmit={createNewFolder}
              colorOptions={colorOptions}
            />
          )}
          {showNoteModal && (
            <NoteModal
              isOpen={showNoteModal}
              onClose={handleCloseModals}
              title={newNoteTitle}
              onTitleChange={setNewNoteTitle}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              onSave={handleSaveNote}
              editor={editor}
              isRecording={isRecording}
              isReading={isReading}
              onToggleSpeechRecognition={handleToggleSpeechRecognition}
              onReadNote={handleReadNote}
              colorOptions={colorOptions}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MainApp;
