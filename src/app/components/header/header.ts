/* =====================================================================
   FILE: components/header/header.ts
   WHAT: The top bar of the site.
   FIGMA: Select the header in "Class of 2028 · Student directory".
          Notice 3 parts: logo + title, 3 navigation links, login button.
   ===================================================================== */
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-header',
  // STEP 1: RouterLink makes links navigate WITHOUT reloading the page.
  // RouterLinkActive adds a CSS class to the link of the current page.
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // STEP 2: Navigation data as an array. WHY: the template loops over it
  // with @for, so adding a link means adding one line here, not HTML.
  // `exact: true` means "active only on exactly '/'". Without it the home
  // link would look active on EVERY page, because every URL starts with '/'.
  protected readonly navLinks = [
    { label: 'Class of 2028', path: '/', exact: true },
    { label: 'Teachers & Staff', path: '/teachers', exact: false },
    { label: 'Gallery', path: '/gallery', exact: false },
  ];

  // STEP 3: A signal holds a value that, when it changes, updates the
  // screen automatically. Here: did the logo image fail to load?
  protected readonly logoFailed = signal(false);

  // The shared saved list. The header only reads it; the service owns it.
  protected readonly saved = inject(SavedService);
}