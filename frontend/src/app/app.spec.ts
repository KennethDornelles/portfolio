import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { App } from './app';
import { LanguageService } from './core/services/language.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .overrideProvider(LanguageService, {
        useValue: {
          state: signal('error'),
          errorMessage: signal('Falha controlada'),
          initialize: vi.fn(),
        },
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders a controlled message instead of translation keys on initial failure', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')?.textContent).toContain(
      'Conteúdo temporariamente indisponível',
    );
    expect(compiled.textContent).not.toContain('NAV_HOME');
  });
});
