/* =====================================================================
   FILE: src/app/services/story-draft.service.ts
   WHAT: The ONLY place that talks to localStorage for story drafts.
   WHY: Components ask; they do not care where the data lives.
   ===================================================================== */
import { Injectable } from '@angular/core';
import { StoredStoryDraft, StoryDraft } from '../models/story-draft.model';

@Injectable({ providedIn: 'root' })
export class StoryDraftService {
  // One key PER STUDENT so two students on one PC do not see each other's draft.
  private key(studentId: number): string {
    return `giu:story-draft:${studentId}`;
  }

  // Read. getItem gives TEXT, or null if nothing is saved.
  load(studentId: number): StoredStoryDraft | null {
    try {
      const text = localStorage.getItem(this.key(studentId));
      return text ? (JSON.parse(text) as StoredStoryDraft) : null;
    } catch {
      // Damaged text makes JSON.parse throw; do not break the page.
      return null;
    }
  }

  // Write. Returns the save time, or null if the browser refused (storage full).
  save(studentId: number, values: StoryDraft): string | null {
    const stored: StoredStoryDraft = { savedAt: new Date().toISOString(), values };
    try {
      localStorage.setItem(this.key(studentId), JSON.stringify(stored));
      return stored.savedAt;
    } catch {
      return null;
    }
  }

  // Delete. Used after the student publishes.
  clear(studentId: number): void {
    localStorage.removeItem(this.key(studentId));
  }
}