/* =====================================================================
   FILE: src/app/guards/auth.guard.ts
   WHAT: A function the router runs BEFORE it opens a page.
   WHY: /profile is for signed-in students only.
   ===================================================================== */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // We already know the user (they just logged in). Let them in.
  if (auth.currentUser()) {
    return true;
  }

  // After a reload the signal is empty but the COOKIE is still there.
  // Ask the server "who am I?" before deciding.
  return auth.checkSession().pipe(
    map(() => true),
    // 401 means no valid cookie. A UrlTree is a redirect.
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};