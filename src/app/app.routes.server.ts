import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
 {
 path: 'students/:id',
 renderMode: RenderMode.Server,
 },
 // These pages depend on the browser (cookies and storage), so the server
 // does not draw them. The browser does. Explained in a later lab.
 { path: 'login', renderMode: RenderMode.Client }, // <- add
 { path: 'profile', renderMode: RenderMode.Client }, // <- add
 {
 path: '**',
 renderMode: RenderMode.Prerender,
 },
];