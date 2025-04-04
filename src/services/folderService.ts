import { api } from './index';

export interface Folder {
  id: string;
  title: string;
  color: string;
  parentFolderId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

class FolderService {
  async getAllFolders(): Promise<Folder[]> {
    const response = await api.get<Folder[]>('/folders/getFolders');
    return response.data;
  }

  async createFolder(folder: Partial<Folder>): Promise<Folder> {
    const response = await api.post<Folder>('/folders/createFolder', folder);
    return response.data;
  }

  async updateFolder(id: string, folder: Partial<Folder>): Promise<Folder> {
    const response = await api.put<Folder>(`/folders/${id}`, folder);
    return response.data;
  }

  async deleteFolder(id: string): Promise<void> {
    await api.delete(`/folders/${id}`);
  }

  async restoreFolder(id: string): Promise<Folder> {
    const response = await api.patch<Folder>(`/folders/${id}/restore`);
    return response.data;
  }
}

export const folderService = new FolderService();
