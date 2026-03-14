import { parseISO, isToday, isThisWeek, isThisMonth } from "date-fns";
import { v4 as uuidv4 } from "uuid";

interface NoteConfig {
  defaultFolder: string;
  autoSave: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  pinned: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class NoteManager {
  private config: NoteConfig;
  private notes: Map<string, Note> = new Map();

  constructor(config: NoteConfig) {
    this.config = config;
  }

  createNote(note: Omit<Note, "id" | "createdAt" | "updatedAt">): Note {
    const newNote: Note = {
      ...note,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notes.set(newNote.id, newNote);
    return newNote;
  }

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    const updatedNote: Note = {
      ...note,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  deleteNote(id: string): boolean {
    return this.notes.delete(id);
  }

  getNote(id: string): Note | null {
    return this.notes.get(id) || null;
  }

  getNotesByUserId(userId: string): Note[] {
    return Array.from(this.notes.values()).filter((note) => note.userId === userId);
  }

  getNotesByFolder(folder: string, userId?: string): Note[] {
    return Array.from(this.notes.values()).filter((note) => {
      const matchesFolder = note.folder === folder;
      const matchesUser = !userId || note.userId === userId;
      return matchesFolder && matchesUser;
    });
  }

  getNotesByTag(tag: string, userId?: string): Note[] {
    return Array.from(this.notes.values()).filter((note) => {
      const matchesTag = note.tags.includes(tag);
      const matchesUser = !userId || note.userId === userId;
      return matchesTag && matchesUser;
    });
  }

  getPinnedNotes(userId?: string): Note[] {
    return Array.from(this.notes.values()).filter((note) => {
      const isPinned = note.pinned;
      const matchesUser = !userId || note.userId === userId;
      return isPinned && matchesUser;
    });
  }

  searchNotes(query: string, userId?: string): Note[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.notes.values()).filter((note) => {
      const matchesQuery =
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
      const matchesUser = !userId || note.userId === userId;
      return matchesQuery && matchesUser;
    });
  }

  getRecentNotes(days: number = 7, userId?: string): Note[] {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return Array.from(this.notes.values()).filter((note) => {
      const noteDate = parseISO(note.updatedAt);
      const isRecent = noteDate >= cutoffDate;
      const matchesUser = !userId || note.userId === userId;
      return isRecent && matchesUser;
    });
  }

  getNotesByDateRange(startDate: string, endDate: string, userId?: string): Note[] {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    return Array.from(this.notes.values()).filter((note) => {
      const noteDate = parseISO(note.updatedAt);
      const inDateRange = noteDate >= start && noteDate <= end;
      const matchesUser = !userId || note.userId === userId;
      return inDateRange && matchesUser;
    });
  }

  pinNote(id: string): Note | null {
    return this.updateNote(id, { pinned: true });
  }

  unpinNote(id: string): Note | null {
    return this.updateNote(id, { pinned: false });
  }

  moveNote(id: string, folder: string): Note | null {
    return this.updateNote(id, { folder });
  }

  addTag(id: string, tag: string): Note | null {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    if (!note.tags.includes(tag)) {
      return this.updateNote(id, { tags: [...note.tags, tag] });
    }

    return note;
  }

  removeTag(id: string, tag: string): Note | null {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    return this.updateNote(id, {
      tags: note.tags.filter((t) => t !== tag),
    });
  }

  updateConfig(config: Partial<NoteConfig>) {
    this.config = { ...this.config, ...config };
  }

  getStats(userId?: string): {
    totalNotes: number;
    pinnedNotes: number;
    folders: Record<string, number>;
    tags: Record<string, number>;
    recentNotes: number;
  } {
    const notes = userId ? this.getNotesByUserId(userId) : Array.from(this.notes.values());
    const recentNotes = this.getRecentNotes(7, userId).length;

    const folders = notes.reduce(
      (acc, note) => {
        acc[note.folder] = (acc[note.folder] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const tags = notes.reduce(
      (acc, note) => {
        note.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalNotes: notes.length,
      pinnedNotes: notes.filter((note) => note.pinned).length,
      folders,
      tags,
      recentNotes,
    };
  }

  getFolders(userId?: string): string[] {
    const notes = userId ? this.getNotesByUserId(userId) : Array.from(this.notes.values());
    const folders = new Set(notes.map((note) => note.folder));
    return Array.from(folders);
  }

  getTags(userId?: string): string[] {
    const notes = userId ? this.getNotesByUserId(userId) : Array.from(this.notes.values());
    const tags = new Set<string>();
    notes.forEach((note) => {
      note.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }
}

// Mock implementation for testing
export class MockNoteManager extends NoteManager {
  constructor() {
    super({
      defaultFolder: "General",
      autoSave: true,
    });

    // Add some mock notes
    this.createNote({
      title: "Meeting Notes",
      content: "Discussed project timeline and next steps.",
      folder: "Work",
      tags: ["meeting", "work"],
      pinned: true,
      userId: "user1",
    });

    this.createNote({
      title: "Shopping List",
      content: "Milk, eggs, bread, vegetables",
      folder: "Personal",
      tags: ["shopping", "personal"],
      pinned: false,
      userId: "user1",
    });

    this.createNote({
      title: "Ideas",
      content: "New project ideas and brainstorming.",
      folder: "General",
      tags: ["ideas", "personal"],
      pinned: true,
      userId: "user1",
    });
  }

  createNote(note: Omit<Note, "id" | "createdAt" | "updatedAt">): Note {
    console.log("Creating note:", note.title);
    return super.createNote(note);
  }

  getRecentNotes(days: number = 7, userId?: string): Note[] {
    const notes = super.getRecentNotes(days, userId);
    console.log(`Found ${notes.length} recent notes in the last ${days} days`);
    return notes;
  }

  searchNotes(query: string, userId?: string): Note[] {
    const notes = super.searchNotes(query, userId);
    console.log(`Found ${notes.length} notes matching query: ${query}`);
    return notes;
  }
}
