import { Plus } from "lucide-react";
import { UserProfile } from "./UserProfile";

interface SidebarProps {
  onNewItem: () => void;
}

export const Sidebar = ({ onNewItem }: SidebarProps) => {
  return (
    <div className="w-64 bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 border-r border-gray-200 flex flex-col sidebar">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl pt-4 font-semibold">Elevatics AI</span>
        </div>
      </div>
      <div className="flex-1 p-4">
        <button
          onClick={onNewItem}
          className="flex items-center gap-2 w-full p-2 rounded-lg bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-50  hover:bg-gray-100 button"
        >
          <Plus size={20} />
          <span>Add new</span>
        </button>
        {/* <button className="flex items-center gap-2 w-full p-2 rounded-lg bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-50  hover:bg-gray-100 button">
          <Home size={20} />
          <span>Home</span>
        </button>
        <button className="flex items-center gap-2 w-full p-2 rounded-lg bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-50  hover:bg-gray-100 button">
          <Calendar size={20} />
          <span>Calendar</span>
        </button>
        <button className="flex items-center gap-2 w-full p-2 rounded-lg bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-50  hover:bg-gray-100 button">
          <Archive size={20} />
          <span>Archive</span>
        </button>
        <button className="flex items-center pt-5 gap-2 w-full p-2 rounded-lg bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-50  hover:bg-gray-100 button">
          <Trash2 size={20} />
          <span>Trash</span>
        </button>*/}
      </div>
      <div className="p-4 border-t border-gray-200">
        <UserProfile />
      </div>
    </div>
  );
};
