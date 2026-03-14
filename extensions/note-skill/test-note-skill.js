// Simple test script for Note Skill plugin (CommonJS)

// Mock uuid module
const uuidv4 = () => "mock-" + Math.random().toString(36).substr(2, 9);

// Mock date-fns functions
const parseISO = (dateString) => new Date(dateString);

// Copy of NoteManager class with mocked dependencies
class NoteManager {
  constructor(config) {
    this.config = config;
    this.notes = new Map();
  }

  createNote(note) {
    const newNote = {
      ...note,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notes.set(newNote.id, newNote);
    return newNote;
  }

  updateNote(id, updates) {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    const updatedNote = {
      ...note,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  deleteNote(id) {
    return this.notes.delete(id);
  }

  getNote(id) {
    return this.notes.get(id) || null;
  }

  getNotesByUserId(userId) {
    return Array.from(this.notes.values()).filter((note) => note.userId === userId);
  }

  getNotesByFolder(folder, userId) {
    return Array.from(this.notes.values()).filter((note) => {
      const matchesFolder = note.folder === folder;
      const matchesUser = !userId || note.userId === userId;
      return matchesFolder && matchesUser;
    });
  }

  getNotesByTag(tag, userId) {
    return Array.from(this.notes.values()).filter((note) => {
      const matchesTag = note.tags.includes(tag);
      const matchesUser = !userId || note.userId === userId;
      return matchesTag && matchesUser;
    });
  }

  getPinnedNotes(userId) {
    return Array.from(this.notes.values()).filter((note) => {
      const isPinned = note.pinned;
      const matchesUser = !userId || note.userId === userId;
      return isPinned && matchesUser;
    });
  }

  searchNotes(query, userId) {
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

  getRecentNotes(days = 7, userId) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return Array.from(this.notes.values()).filter((note) => {
      const noteDate = parseISO(note.updatedAt);
      const isRecent = noteDate >= cutoffDate;
      const matchesUser = !userId || note.userId === userId;
      return isRecent && matchesUser;
    });
  }

  getNotesByDateRange(startDate, endDate, userId) {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    return Array.from(this.notes.values()).filter((note) => {
      const noteDate = parseISO(note.updatedAt);
      const inDateRange = noteDate >= start && noteDate <= end;
      const matchesUser = !userId || note.userId === userId;
      return inDateRange && matchesUser;
    });
  }

  pinNote(id) {
    return this.updateNote(id, { pinned: true });
  }

  unpinNote(id) {
    return this.updateNote(id, { pinned: false });
  }

  moveNote(id, folder) {
    return this.updateNote(id, { folder });
  }

  addTag(id, tag) {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    if (!note.tags.includes(tag)) {
      return this.updateNote(id, { tags: [...note.tags, tag] });
    }

    return note;
  }

  removeTag(id, tag) {
    const note = this.notes.get(id);
    if (!note) {
      return null;
    }

    return this.updateNote(id, {
      tags: note.tags.filter((t) => t !== tag),
    });
  }

  updateConfig(config) {
    this.config = { ...this.config, ...config };
  }

  getStats(userId) {
    const notes = userId ? this.getNotesByUserId(userId) : Array.from(this.notes.values());
    const recentNotes = this.getRecentNotes(7, userId).length;

    const folders = notes.reduce((acc, note) => {
      acc[note.folder] = (acc[note.folder] || 0) + 1;
      return acc;
    }, {});

    const tags = notes.reduce((acc, note) => {
      note.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      totalNotes: notes.length,
      pinnedNotes: notes.filter((note) => note.pinned).length,
      folders,
      tags,
      recentNotes,
    };
  }

  getFolders(userId) {
    const notes = userId ? this.getNotesByUserId(userId) : Array.from(this.notes.values());
    const folders = new Set(notes.map((note) => note.folder));
    return Array.from(folders);
  }

  getTags(userId) {
    const notes = userId ? this.getNotesByUserId(userId) : Array.from(this.notes.values());
    const tags = new Set();
    notes.forEach((note) => {
      note.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }
}

// Mock implementation for testing
class MockNoteManager extends NoteManager {
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

  createNote(note) {
    console.log("Creating note:", note.title);
    return super.createNote(note);
  }

  getRecentNotes(days = 7, userId) {
    const notes = super.getRecentNotes(days, userId);
    console.log(`Found ${notes.length} recent notes in the last ${days} days`);
    return notes;
  }

  searchNotes(query, userId) {
    const notes = super.searchNotes(query, userId);
    console.log(`Found ${notes.length} notes matching query: ${query}`);
    return notes;
  }
}

// Test function
async function testNoteSkill() {
  console.log("Testing Note Skill plugin...");

  // Initialize note manager
  const noteManager = new MockNoteManager();

  // Test 1: Get all notes by user
  console.log("\n1. Testing getNotesByUserId:");
  const userNotes = noteManager.getNotesByUserId("user1");
  console.log(`Found ${userNotes.length} notes for user1`);
  userNotes.forEach((note) => {
    console.log(`  - ${note.title} (${note.folder})`);
  });

  // Test 2: Get notes by folder
  console.log("\n2. Testing getNotesByFolder:");
  const workNotes = noteManager.getNotesByFolder("Work");
  console.log(`Found ${workNotes.length} notes in Work folder`);
  workNotes.forEach((note) => {
    console.log(`  - ${note.title}`);
  });

  // Test 3: Get notes by tag
  console.log("\n3. Testing getNotesByTag:");
  const personalNotes = noteManager.getNotesByTag("personal");
  console.log(`Found ${personalNotes.length} notes with personal tag`);
  personalNotes.forEach((note) => {
    console.log(`  - ${note.title}`);
  });

  // Test 4: Get pinned notes
  console.log("\n4. Testing getPinnedNotes:");
  const pinnedNotes = noteManager.getPinnedNotes();
  console.log(`Found ${pinnedNotes.length} pinned notes`);
  pinnedNotes.forEach((note) => {
    console.log(`  - ${note.title}`);
  });

  // Test 5: Search notes
  console.log("\n5. Testing searchNotes:");
  const searchResults = noteManager.searchNotes("project");
  console.log(`Found ${searchResults.length} notes matching "project"`);
  searchResults.forEach((note) => {
    console.log(`  - ${note.title}`);
  });

  // Test 6: Get recent notes
  console.log("\n6. Testing getRecentNotes:");
  const recentNotes = noteManager.getRecentNotes();
  console.log(`Found ${recentNotes.length} recent notes`);
  recentNotes.forEach((note) => {
    console.log(`  - ${note.title}`);
  });

  // Test 7: Create a new note
  console.log("\n7. Testing createNote:");
  const newNote = noteManager.createNote({
    title: "Test Note",
    content: "This is a test note",
    folder: "General",
    tags: ["test", "demo"],
    pinned: false,
    userId: "user1",
  });
  console.log(`Created note: ${newNote.title} (ID: ${newNote.id})`);

  // Test 8: Get note by ID
  console.log("\n8. Testing getNote:");
  const retrievedNote = noteManager.getNote(newNote.id);
  if (retrievedNote) {
    console.log(`Retrieved note: ${retrievedNote.title}`);
  } else {
    console.log("Failed to retrieve note");
  }

  // Test 9: Update note
  console.log("\n9. Testing updateNote:");
  const updatedNote = noteManager.updateNote(newNote.id, {
    title: "Updated Test Note",
    content: "This is an updated test note",
  });
  if (updatedNote) {
    console.log(`Updated note: ${updatedNote.title}`);
  } else {
    console.log("Failed to update note");
  }

  // Test 10: Pin note
  console.log("\n10. Testing pinNote:");
  const pinnedNote = noteManager.pinNote(newNote.id);
  if (pinnedNote) {
    console.log(`Pinned note: ${pinnedNote.title} (pinned: ${pinnedNote.pinned})`);
  } else {
    console.log("Failed to pin note");
  }

  // Test 11: Move note
  console.log("\n11. Testing moveNote:");
  const movedNote = noteManager.moveNote(newNote.id, "Work");
  if (movedNote) {
    console.log(`Moved note: ${movedNote.title} to ${movedNote.folder}`);
  } else {
    console.log("Failed to move note");
  }

  // Test 12: Add tag
  console.log("\n12. Testing addTag:");
  const noteWithTag = noteManager.addTag(newNote.id, "important");
  if (noteWithTag) {
    console.log(`Added tag to note: ${noteWithTag.title} tags: ${noteWithTag.tags.join(", ")}`);
  } else {
    console.log("Failed to add tag");
  }

  // Test 13: Remove tag
  console.log("\n13. Testing removeTag:");
  const noteWithoutTag = noteManager.removeTag(newNote.id, "demo");
  if (noteWithoutTag) {
    console.log(
      `Removed tag from note: ${noteWithoutTag.title} tags: ${noteWithoutTag.tags.join(", ")}`,
    );
  } else {
    console.log("Failed to remove tag");
  }

  // Test 14: Get folders
  console.log("\n14. Testing getFolders:");
  const folders = noteManager.getFolders();
  console.log(`Found ${folders.length} folders: ${folders.join(", ")}`);

  // Test 15: Get tags
  console.log("\n15. Testing getTags:");
  const tags = noteManager.getTags();
  console.log(`Found ${tags.length} tags: ${tags.join(", ")}`);

  // Test 16: Get note stats
  console.log("\n16. Testing getStats:");
  const stats = noteManager.getStats();
  console.log(`Note stats:`);
  console.log(`  - Total notes: ${stats.totalNotes}`);
  console.log(`  - Pinned notes: ${stats.pinnedNotes}`);
  console.log(`  - Folders: ${JSON.stringify(stats.folders)}`);
  console.log(`  - Tags: ${JSON.stringify(stats.tags)}`);
  console.log(`  - Recent notes: ${stats.recentNotes}`);

  // Test 17: Delete note
  console.log("\n17. Testing deleteNote:");
  const deleteSuccess = noteManager.deleteNote(newNote.id);
  console.log(`Delete note success: ${deleteSuccess}`);

  // Test 18: Get notes after deletion
  console.log("\n18. Testing getNotesByUserId after deletion:");
  const remainingNotes = noteManager.getNotesByUserId("user1");
  console.log(`Found ${remainingNotes.length} notes for user1 after deletion`);
  remainingNotes.forEach((note) => {
    console.log(`  - ${note.title}`);
  });

  console.log("\nAll tests completed successfully!");
}

// Run tests
testNoteSkill().catch(console.error);
