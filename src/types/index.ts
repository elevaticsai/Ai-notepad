export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  color: string;
  folderId: string | null;
  tags: string[];
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Folder {
  _id: string;
  userId: string;
  title: string;
  color: string;
  parentFolderId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ColorOption {
  name: string;
  value: string;
}

export type ViewType = "home" | "editor" | "folder";
export type TimePeriod = "Todays" | "Weekly" | "Monthly" | "All";
export type NewItemType = "note" | "folder" | null;
