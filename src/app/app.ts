/* =====================================================================
   FILE: src/app/app.ts   (the ROOT component)
   WHAT: The outer "shell" every page lives inside: header on top,
         page content in the middle.
   ===================================================================== */
import { Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { TopStrip } from './components/top-strip/top-strip';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  // STEP 1: A standalone component must LIST every component, directive
  // or pipe it uses in its template. Forgetting one gives the error
  // "'app-header' is not a known element".
  imports: [RouterOutlet, Header, TopStrip],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly auth = inject(AuthService);

  constructor() {
    // After a reload the signal is empty, but the cookie may still be valid.
    // A 401 just means "not signed in", so we ignore that error.
    afterNextRender(() => this.auth.checkSession().subscribe({ error: () => {} }));
  }
}
