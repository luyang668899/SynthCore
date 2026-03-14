import { OpenClawPluginApi, OpenClawPlugin } from "openclaw/plugin-sdk";
import { MockNoteManager } from "./src/note-manager";

export const NoteSkillPlugin: OpenClawPlugin = {
  id: "note-skill",
  name: "Note Skill",
  version: "2026.2.17",
  description: "Note management and storage skill for OpenClaw",
  author: "OpenClaw Team",
  license: "MIT",

  register: async (api: OpenClawPluginApi) => {
    console.log("Registering Note Skill plugin...");

    // Initialize note manager with mock implementation for testing
    const noteManager = new MockNoteManager();

    // Register note tools
    api.registerTool({
      id: "note_create",
      name: "Create Note",
      description: "Create a new note",
      parameters: {
        note: {
          type: "object",
          description: "Note details",
          required: true,
        },
      },
      handler: async (params) => {
        const note = params.note as any;
        const newNote = noteManager.createNote(note);
        return { note: newNote };
      },
    });

    api.registerTool({
      id: "note_update",
      name: "Update Note",
      description: "Update an existing note",
      parameters: {
        id: {
          type: "string",
          description: "Note ID",
          required: true,
        },
        updates: {
          type: "object",
          description: "Note updates",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const updates = params.updates as any;
        const updatedNote = noteManager.updateNote(id, updates);
        return { note: updatedNote };
      },
    });

    api.registerTool({
      id: "note_delete",
      name: "Delete Note",
      description: "Delete a note",
      parameters: {
        id: {
          type: "string",
          description: "Note ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const success = noteManager.deleteNote(id);
        return { success };
      },
    });

    api.registerTool({
      id: "note_get",
      name: "Get Note",
      description: "Get a note by ID",
      parameters: {
        id: {
          type: "string",
          description: "Note ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const note = noteManager.getNote(id);
        return { note };
      },
    });

    api.registerTool({
      id: "note_get_by_user",
      name: "Get Notes by User",
      description: "Get all notes for a user",
      parameters: {
        userId: {
          type: "string",
          description: "User ID",
          required: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const notes = noteManager.getNotesByUserId(userId);
        return { notes };
      },
    });

    api.registerTool({
      id: "note_get_by_folder",
      name: "Get Notes by Folder",
      description: "Get notes by folder",
      parameters: {
        folder: {
          type: "string",
          description: "Folder name",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const folder = params.folder as string;
        const userId = params.userId as string;
        const notes = noteManager.getNotesByFolder(folder, userId);
        return { notes };
      },
    });

    api.registerTool({
      id: "note_get_by_tag",
      name: "Get Notes by Tag",
      description: "Get notes by tag",
      parameters: {
        tag: {
          type: "string",
          description: "Tag",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const tag = params.tag as string;
        const userId = params.userId as string;
        const notes = noteManager.getNotesByTag(tag, userId);
        return { notes };
      },
    });

    api.registerTool({
      id: "note_get_pinned",
      name: "Get Pinned Notes",
      description: "Get pinned notes",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const notes = noteManager.getPinnedNotes(userId);
        return { notes };
      },
    });

    api.registerTool({
      id: "note_search",
      name: "Search Notes",
      description: "Search notes by query",
      parameters: {
        query: {
          type: "string",
          description: "Search query",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const query = params.query as string;
        const userId = params.userId as string;
        const notes = noteManager.searchNotes(query, userId);
        return { notes };
      },
    });

    api.registerTool({
      id: "note_get_recent",
      name: "Get Recent Notes",
      description: "Get recent notes",
      parameters: {
        days: {
          type: "number",
          description: "Number of days to look back",
          optional: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const days = (params.days as number) || 7;
        const userId = params.userId as string;
        const notes = noteManager.getRecentNotes(days, userId);
        return { notes };
      },
    });

    api.registerTool({
      id: "note_get_by_date_range",
      name: "Get Notes by Date Range",
      description: "Get notes within a date range",
      parameters: {
        startDate: {
          type: "string",
          description: "Start date (ISO format)",
          required: true,
        },
        endDate: {
          type: "string",
          description: "End date (ISO format)",
          required: true,
        },
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const startDate = params.startDate as string;
        const endDate = params.endDate as string;
        const userId = params.userId as string;
        const notes = noteManager.getNotesByDateRange(startDate, endDate, userId);
        return { notes };
      },
    });

    api.registerTool({
      id: "note_pin",
      name: "Pin Note",
      description: "Pin a note",
      parameters: {
        id: {
          type: "string",
          description: "Note ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const note = noteManager.pinNote(id);
        return { note };
      },
    });

    api.registerTool({
      id: "note_unpin",
      name: "Unpin Note",
      description: "Unpin a note",
      parameters: {
        id: {
          type: "string",
          description: "Note ID",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const note = noteManager.unpinNote(id);
        return { note };
      },
    });

    api.registerTool({
      id: "note_move",
      name: "Move Note",
      description: "Move a note to a different folder",
      parameters: {
        id: {
          type: "string",
          description: "Note ID",
          required: true,
        },
        folder: {
          type: "string",
          description: "Folder name",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const folder = params.folder as string;
        const note = noteManager.moveNote(id, folder);
        return { note };
      },
    });

    api.registerTool({
      id: "note_add_tag",
      name: "Add Tag to Note",
      description: "Add a tag to a note",
      parameters: {
        id: {
          type: "string",
          description: "Note ID",
          required: true,
        },
        tag: {
          type: "string",
          description: "Tag name",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const tag = params.tag as string;
        const note = noteManager.addTag(id, tag);
        return { note };
      },
    });

    api.registerTool({
      id: "note_remove_tag",
      name: "Remove Tag from Note",
      description: "Remove a tag from a note",
      parameters: {
        id: {
          type: "string",
          description: "Note ID",
          required: true,
        },
        tag: {
          type: "string",
          description: "Tag name",
          required: true,
        },
      },
      handler: async (params) => {
        const id = params.id as string;
        const tag = params.tag as string;
        const note = noteManager.removeTag(id, tag);
        return { note };
      },
    });

    api.registerTool({
      id: "note_get_stats",
      name: "Get Note Stats",
      description: "Get note statistics",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const stats = noteManager.getStats(userId);
        return { stats };
      },
    });

    api.registerTool({
      id: "note_get_folders",
      name: "Get Folders",
      description: "Get all folders",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const folders = noteManager.getFolders(userId);
        return { folders };
      },
    });

    api.registerTool({
      id: "note_get_tags",
      name: "Get Tags",
      description: "Get all tags",
      parameters: {
        userId: {
          type: "string",
          description: "User ID (optional)",
          optional: true,
        },
      },
      handler: async (params) => {
        const userId = params.userId as string;
        const tags = noteManager.getTags(userId);
        return { tags };
      },
    });

    api.registerTool({
      id: "note_config",
      name: "Note Config",
      description: "Update note configuration",
      parameters: {
        note: {
          type: "object",
          description: "Note configuration",
          required: true,
        },
      },
      handler: async (params) => {
        const noteConfig = params.note as any;
        noteManager.updateConfig(noteConfig);
        return { success: true };
      },
    });

    console.log("Note Skill plugin registered successfully");
  },

  unregister: async (api: OpenClawPluginApi) => {
    console.log("Unregistering Note Skill plugin...");
    // Cleanup resources if needed
    console.log("Note Skill plugin unregistered successfully");
  },
};

export default NoteSkillPlugin;
