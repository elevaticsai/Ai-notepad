import { X, FileText, FolderIcon } from "lucide-react";
import { format } from "date-fns";
import { ColorOption, NewItemType } from "../../types";

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemTypeSelect: (type: "note" | "folder") => void;
  itemType: NewItemType;
  title: string;
  onTitleChange: (title: string) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onSubmit: () => void;
  colorOptions: ColorOption[];
}

export const NewItemModal = ({
  isOpen,
  onClose,
  onItemTypeSelect,
  itemType,
  title,
  onTitleChange,
  selectedColor,
  onColorSelect,
  onSubmit,
  colorOptions,
}: NewItemModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {!itemType ? (
          <div className="space-y-4">
            <button
              onClick={() => onItemTypeSelect("note")}
              className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center gap-3"
            >
              <FileText size={24} className="text-blue-500" />
              <div className="text-left">
                <div className="font-medium">New Note</div>
                <div className="text-sm text-gray-500">
                  Create a new note
                </div>
              </div>
            </button>
            <button
              onClick={() => onItemTypeSelect("folder")}
              className="w-full p-4 border rounded-lg hover:bg-gray-50 flex items-center gap-3"
            >
              <FolderIcon size={24} className="text-yellow-500" />
              <div className="text-left">
                <div className="font-medium">New Folder</div>
                <div className="text-sm text-gray-500">
                  Create a new folder
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => onColorSelect(color.value)}
                    className={`w-6 h-6 rounded-full ${color.value} ${
                      selectedColor === color.value
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Created
              </label>
              <div className="text-sm text-gray-500">
                {format(new Date(), "MMMM dd, yyyy")}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
