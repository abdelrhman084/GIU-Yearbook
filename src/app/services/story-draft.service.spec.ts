import { TestBed } from '@angular/core/testing';
import { StoryDraft } from '../models/story-draft.model';
import { StoryDraftService } from './story-draft.service';

describe('StoryDraftService', () => {
  let drafts: StoryDraftService;
  const values: StoryDraft = {
    quote: 'Build things.', story: 'Four years.', moment: 'Demo day.', next: 'Masters.', consent: true,
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    drafts = TestBed.inject(StoryDraftService);
  });

  afterEach(() => vi.restoreAllMocks());

  it('saves, loads, and clears drafts per student key', () => {
    expect(drafts.load(1)).toBeNull();

    const savedAt = drafts.save(7, values);
    expect(localStorage.getItem('giu:story-draft:7')).not.toBeNull();
    expect(drafts.load(7)).toEqual({ savedAt, values });

    drafts.clear(7);
    expect(drafts.load(7)).toBeNull();
  });

  it('returns null instead of crashing when the saved text is damaged', () => {
    localStorage.setItem('giu:story-draft:1', '{ this is not json');
    expect(drafts.load(1)).toBeNull();
  });

  it('returns null from save when storage is full', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });

    expect(drafts.save(1, values)).toBeNull();
  });
});