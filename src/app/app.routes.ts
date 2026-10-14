/* =====================================================================
   FILE: src/app/app.routes.ts
   WHAT: The map between URLs and pages.
   WHY:  A single-page app never reloads. The router swaps the page
         inside <router-outlet> (see app.html) when the URL changes.
   ===================================================================== */
import { Routes } from '@angular/router';

import { StudentsPage } from './pages/students-page/students-page';
import { PlaceholderPage } from './pages/placeholder-page/placeholder-page';

export const routes: Routes = [
  // STEP 1: The landing page. An empty path '' means "the home URL".
  // It stays EAGER (imported above) because everybody sees it first.
  { path: '', component: StudentsPage, title: 'Class of 2028 · GIU Yearbook' },

  // STEP 2: The Teachers & Staff page is LAZY loaded. `loadComponent` takes
  // a function that Angular calls only when the user visits /teachers.
  // `import('...')` (a dynamic import) downloads the page's code at that
  // moment, as a separate chunk. There is no import for StaffPage at the
  // top of this file on purpose: that is what keeps it out of the main bundle.
  {
    path: 'teachers',
    title: 'Teachers & Staff · GIU Yearbook',
    loadComponent: () => import('./pages/staff-page/staff-page').then((m) => m.StaffPage),
  },

  // STEP 3: Pages we have NOT designed/built yet use one placeholder page.
  // `data` lets us pass a small piece of information (the title) to it.
  // TIP: When you build the real page, replace `PlaceholderPage` with it.
  { path: 'gallery', component: PlaceholderPage, data: { title: 'Gallery' } },
  { path: 'login', component: PlaceholderPage, data: { title: 'Student login' } },

  // STEP 4: `:id` is a route PARAMETER. /students/3 and /students/7 both
  // match this route. The page can read the number later.
  { path: 'students/:id', component: PlaceholderPage, data: { title: 'Student story' } },

  // STEP 5: Wildcard. Any unknown URL goes back to the home page.
  // COMMON MISTAKE: this MUST be last. Routes are matched top to bottom.
  { path: '**', redirectTo: '' },
];