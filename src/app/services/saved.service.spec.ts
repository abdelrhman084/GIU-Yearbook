import { SavedService } from './saved.service';

describe('SavedService', () => {
  let service: SavedService;

  beforeEach(() => {
    service = new SavedService(); // Fresh instance per test
  });

  it('starts with nobody saved', () => {
    expect(service.ids()).toEqual([]);
    expect(service.count()).toBe(0); // Call signals with ()
  });

  it('saves a student when toggled once and removes when toggled twice', () => {
    service.toggle(3);
    expect(service.isSaved(3)).toBe(true);
    expect(service.count()).toBe(1);

    service.toggle(3);
    expect(service.isSaved(3)).toBe(false);
    expect(service.count()).toBe(0);
  });

  it('keeps students independent of each other', () => {
    service.toggle(1);
    service.toggle(2);
    service.toggle(1); // un-save student 1 only

    expect(service.ids()).toEqual([2]);
    expect(service.isSaved(1)).toBe(false);
    expect(service.isSaved(2)).toBe(true);
  });

  it('gives a new array every time, never the same one changed', () => {
    const before = service.ids();
    service.toggle(1);

    expect(service.ids()).not.toBe(before);
    expect(before).toEqual([]);
  });
});