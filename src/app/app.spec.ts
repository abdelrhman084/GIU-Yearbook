import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService, User } from './services/auth.service';
import { SavedService } from './services/saved.service';
import { App } from './app';

describe('App', () => {
  const auth = {
    currentUser: signal<User | null>(null),
    checkSession: vi.fn().mockReturnValue(of(null)),
  };
  const saved = { count: signal(0), isSaved: vi.fn(), toggle: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: SavedService, useValue: saved },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});