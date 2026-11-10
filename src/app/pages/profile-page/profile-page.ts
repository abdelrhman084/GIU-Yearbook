/* =====================================================================
   FILE: pages/profile-page/profile-page.ts
   FIGMA: "My Profile · Student editor". Left: the form. Right: preview.
   ===================================================================== */
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Student } from '../../models/student.model';
import { AuthService } from '../../services/auth.service';
import { StoryDraftService } from '../../services/story-draft.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly students = inject(StudentService);
  private readonly drafts = inject(StoryDraftService);

  // Max lengths come from the Figma hints.
  protected readonly form = this.fb.group({
    quote: ['', [Validators.required, Validators.maxLength(160)]],
    story: ['', [Validators.maxLength(1000)]],
    moment: ['', [Validators.maxLength(200)]],
    next: ['', [Validators.maxLength(120)]],
    consent: [false],
  });

  // A form is NOT a signal. toSignal() turns "the form changed" into a signal.
  protected readonly values = toSignal(this.form.valueChanges.pipe(map(() => this.form.getRawValue())), {
    initialValue: this.form.getRawValue(),
  });

  protected readonly student = signal<Student | null>(null);
  protected readonly user = this.auth.currentUser;

  protected readonly changed = signal(false);
  protected readonly savedAt = signal<string | null>(null);
  protected readonly storageError = signal(false);

  protected readonly quoteLength = computed(() => this.values().quote.length);

  constructor() {
    // Any change after the page is ready means "unsaved changes".
    this.form.valueChanges.subscribe(() => this.changed.set(true));
  }

  ngOnInit(): void {
    // The guard guarantees currentUser() is not null here.
    const studentId = this.auth.currentUser()!.studentId;
    this.students.getStudents().subscribe((list) => {
      const student = list.find((s) => s.id === studentId) ?? null;
      this.student.set(student);
      if (!student) {
        return;
      }
      const draft = this.drafts.load(student.id);
      if (draft) {
        // A saved draft wins over the directory data.
        this.form.patchValue(draft.values);
        this.savedAt.set(draft.savedAt);
      } else {
        this.form.patchValue({ quote: student.quote });
      }
      // patchValue counts as a "change", so reset the flag afterwards.
      this.changed.set(false);
    });
  }

  protected saveDraft(): void {
    const student = this.student();
    if (!student) {
      return;
    }
    // Drafts may be incomplete, so we do not check form.valid here.
    const time = this.drafts.save(student.id, this.form.getRawValue());
    this.storageError.set(time === null);
    if (time) {
      this.savedAt.set(time);
      this.changed.set(false);
    }
  }

  protected signOut(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/'));
  }
}