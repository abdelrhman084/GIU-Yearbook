/* =====================================================================
   FILE: src/app/services/staff.service.ts
   WHAT: The only place that knows where staff data comes from.
   WHY:  Exactly the same pattern as student.service.ts. The page asks
         for staff; it never reads JSON files or URLs itself.

   STEP 1: Copy the structure of StudentService and change three things:
           the interface, the JSON file name and the Laravel URL.
   ===================================================================== */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

import { environment } from '../../environments/environment';
import { StaffMember } from '../models/staff.model';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private http = inject(HttpClient);

  getStaff(): Observable<StaffMember[]> {
    if (environment.useMockApi) {
      // FAKE API: delay(400) lets students SEE the loading state.
      return this.http.get<StaffMember[]>('mock-api/staff.json').pipe(delay(400));
    }
    // REAL API (backend phase): same return type, different URL.
    return this.http.get<StaffMember[]>(`${environment.apiUrl}/staff`);
  }
}
