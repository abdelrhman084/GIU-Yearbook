/* =====================================================================
   FILE: pages/staff-page/staff-page.ts
   WHAT: The Teachers & Staff page: title, filters and the grid of cards.
   WHY: One page owns the staff state; the route will load it lazily.
   ===================================================================== */
import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { StaffMember } from '../../models/staff.model';
import { StaffService } from '../../services/staff.service';

// A type for the sort dropdown. Only these two values are allowed.
type SortMode = 'featured' | 'name';
const PLACEHOLDER = 'images/placeholder-portrait.svg';
@Component({
  selector: 'app-staff-page',
  templateUrl: './staff-page.html',
  styleUrl: './staff-page.css',
})
export class StaffPage implements OnInit {
  // Ask Angular for the service. The page never touches URLs or JSON files.
  private readonly staffService = inject(StaffService);

  // STATE: data that can change while the page is open.
  protected readonly staff = signal<StaffMember[]>([]); // all staff from the "API"
  protected readonly loading = signal(true); // true until data arrives
  protected readonly errorMessage = signal(''); // empty = no error
  protected readonly searchText = signal(''); // what the user typed
  protected readonly selectedDepartment = signal('all'); // dropdown 1
  protected readonly sortBy = signal<SortMode>('featured'); // dropdown 2

  // DERIVED STATE: unique departments for the dropdown.
  protected readonly departments = computed(() =>
    [...new Set(this.staff().map((m) => m.department))].sort(),
  );
protected onPhotoError(event: Event): void {
 const img = event.target as HTMLImageElement;
 if (!img.src.endsWith(PLACEHOLDER)) {
 img.src = PLACEHOLDER;
 }
}

  // The list the page shows: filtered, then sorted.
  protected readonly visibleStaff = computed(() => {
    const text = this.searchText().trim().toLowerCase();
    const dept = this.selectedDepartment();

    const filtered = this.staff().filter(
      (m) => m.name.toLowerCase().includes(text) && (dept === 'all' || m.department === dept),
    );

    // filter() made a fresh array, so sort() does not change the original.
    return this.sortBy() === 'name'
      ? filtered.sort((a, b) => a.name.localeCompare(b.name))
      : filtered.sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id);
  });

  // Runs once after Angular creates the component: start loading the data.
  ngOnInit(): void {
    this.staffService.getStaff().subscribe({
      next: (data) => {
        this.staff.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('We could not load the staff list. Please try again.');
        this.loading.set(false);
      },
    });
  }

  // Event handlers: each reads what the user did and updates a signal.
  protected onSearch(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  protected onDepartmentChange(event: Event): void {
    this.selectedDepartment.set((event.target as HTMLSelectElement).value);
  }

  protected onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value as SortMode);
  }
}