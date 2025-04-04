import { api } from './index';
import { Note } from '../types';

class NoteService {
  async getAllNotes(): Promise<Note[]> {
    const response = await api.get<Note[]>('/notes/getNotes');
    return response.data;
  }

  async createNote(note: Partial<Note>): Promise<Note> {
    const response = await api.post<Note>('/notes/createNotes', note);
    return response.data;
  }

  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    const response = await api.put<Note>(`/notes/updateNotes/${id}`, note);
    return response.data;
  }

  async getNoteDetails(id: string): Promise<Note> {
    const response = await api.get<Note>(`/notes/getNoteDetails/${id}`);
    return response.data;
  }

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  }

  async archiveNote(id: string): Promise<Note> {
    const response = await api.patch<Note>(`/notes/${id}/archive`);
    return response.data;
  }

  async restoreNote(id: string): Promise<Note> {
    const response = await api.patch<Note>(`/notes/${id}/restore`);
    return response.data;
  }
}

export const noteService = new NoteService();
