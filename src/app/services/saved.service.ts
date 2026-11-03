import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SavedService {
  // Only this service can change the list.
  private readonly _ids = signal<number[]>([]);

  // Everybody else gets a read-only view.
  readonly ids = this._ids.asReadonly();

  // Derived state: calculated from the list, never stored.
  readonly count = computed(() => this._ids().length);

  isSaved(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number): void {
    this._ids.update((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }
}