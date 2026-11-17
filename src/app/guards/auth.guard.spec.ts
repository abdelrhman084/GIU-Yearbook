import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { AuthService, User } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const maya: User = { studentId: 1, name: 'Maya Hassan' };

  // Fake AuthService with only the two members the guard uses
  const fakeAuth = {
    currentUser: signal<User | null>(null),
    checkSession: vi.fn(),
  };

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  beforeEach(() => {
    fakeAuth.currentUser.set(null);
    fakeAuth.checkSession.mockReset();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: fakeAuth }],
    });
  });

  it('lets a signed-in user in without asking the server', () => {
    fakeAuth.currentUser.set(maya);

    expect(runGuard()).toBe(true);
    expect(fakeAuth.checkSession).not.toHaveBeenCalled();
  });

  it('lets the user in when the cookie is still valid after a reload', async () => {
    fakeAuth.checkSession.mockReturnValue(of(maya));

    const result = await firstValueFrom(runGuard() as Observable<boolean>);
    expect(result).toBe(true);
  });

  it('sends the visitor to /login when the server says 401', async () => {
    fakeAuth.checkSession.mockReturnValue(throwError(() => new Error('401')));

    const result = await firstValueFrom(runGuard() as Observable<UrlTree>);
    expect(result).toBeInstanceOf(UrlTree);
    expect(result.toString()).toBe('/login');
  });
});