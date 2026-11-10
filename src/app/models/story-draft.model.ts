/* =====================================================================
   FILE: src/app/models/story-draft.model.ts
   WHAT: The shape of what the profile form holds, and what we keep in
         localStorage.
   WHY: localStorage only stores TEXT, so we turn the object into JSON
        text to save it and back into an object to restore it.
   ===================================================================== */
export interface StoryDraft {
  quote: string;
  story: string;
  moment: string;
  next: string;
  consent: boolean;
}

/** What actually sits in localStorage: the form values + when we saved. */
export interface StoredStoryDraft {
  savedAt: string;
  values: StoryDraft;
}