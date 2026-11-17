import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';
import { StudentCard } from './student-card';

describe('StudentCard (unit)', () => {
  let fixture: ComponentFixture<StudentCard>;
  let el: HTMLElement;

  const saved = { isSaved: vi.fn(), toggle: vi.fn() };
  const maya: Student = {
    id: 1, name: 'Maya Hassan', faculty: 'Engineering', classYear: 2026,
    quote: 'Build things that make a difference.', photo: 'images/students/maya-hassan.jpg', featured: true,
  };

  beforeEach(() => {
    saved.isSaved.mockReset();
    saved.isSaved.mockReturnValue(false);
    saved.toggle.mockReset();

    TestBed.configureTestingModule({
      imports: [StudentCard],
      providers: [provideRouter([]), { provide: SavedService, useValue: saved }],
    });
  });

  // Function (not beforeEach) so individual tests can configure fakes BEFORE first render
  async function render(student: Student = maya): Promise<void> {
    fixture = TestBed.createComponent(StudentCard);
    el = fixture.nativeElement;
    fixture.componentRef.setInput('student', student); // Signal inputs must use setInput()
    await fixture.whenStable();                        // Wait for DOM update
  }

  it('shows the name, faculty and updates when the input changes', async () => {
    await render();
    expect(el.querySelector('.card__name')?.textContent).toContain('Maya Hassan');
    expect(el.querySelector('.card__meta')?.textContent).toContain('Engineering');

    fixture.componentRef.setInput('student', { ...maya, id: 2, name: 'Adam Schneider' });
    await fixture.whenStable();
    expect(el.querySelector('.card__name')?.textContent).toContain('Adam Schneider');
  });

  it('shows a filled heart when the service says the student is saved', async () => {
    saved.isSaved.mockReturnValue(true);
    await render();

    const heart = el.querySelector('.card__save') as HTMLButtonElement;
    expect(heart.getAttribute('aria-pressed')).toBe('true');
    expect(heart.classList).toContain('card__save--on');
  });

  it('toggles saved state on click without reaching the card link', async () => {
    await render();
    const card = el.querySelector('.card') as HTMLAnchorElement;
    const heart = el.querySelector('.card__save') as HTMLButtonElement;
    const cardClicked = vi.fn();
    card.addEventListener('click', cardClicked);

    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    heart.dispatchEvent(click);

    expect(saved.toggle).toHaveBeenCalledWith(1);
    expect(click.defaultPrevented).toBe(true);
    expect(cardClicked).not.toHaveBeenCalled();
  });

  it('shows the placeholder portrait when the photo fails to load', async () => {
    await render();
    const photo = el.querySelector('.card__photo') as HTMLImageElement;
    photo.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(photo.getAttribute('src')).toContain('placeholder-portrait.svg');
  });
});