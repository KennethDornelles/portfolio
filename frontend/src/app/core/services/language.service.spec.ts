import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  const pt = {
    NAV_HOME: 'Início',
    HOME_TITLE_1: 'Transformamos',
    BTN_VIEW_PROJECTS: 'Ver Cases',
  };
  const en = {
    NAV_HOME: 'Home',
    HOME_TITLE_1: 'We transform',
    BTN_VIEW_PROJECTS: 'View Cases',
  };

  let service: LanguageService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LanguageService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('waits for the initial PT_BR request and exposes translated text', async () => {
    let completed = false;
    const initialization = service.initialize().then(() => (completed = true));

    expect(completed).toBe(false);
    http.expectOne(`${environment.apiUrl}/i18n/PT_BR`).flush(pt);
    await initialization;

    expect(service.state()).toBe('ready');
    expect(service.translate('NAV_HOME')).toBe('Início');
    expect(service.translate('HOME_TITLE_1')).toBe('Transformamos');
  });

  it('switches to EN_US only after its dictionary is loaded', async () => {
    const initialization = service.initialize();
    http.expectOne(`${environment.apiUrl}/i18n/PT_BR`).flush(pt);
    await initialization;

    const switching = service.setLanguage('EN_US');
    expect(service.currentLang()).toBe('PT_BR');
    expect(service.translate('NAV_HOME')).toBe('Início');
    http.expectOne(`${environment.apiUrl}/i18n/EN_US`).flush(en);
    await switching;

    expect(service.currentLang()).toBe('EN_US');
    expect(service.translate('NAV_HOME')).toBe('Home');
  });

  it('treats an empty response as an initial loading error', async () => {
    const initialization = service.initialize();
    http.expectOne(`${environment.apiUrl}/i18n/PT_BR`).flush({});
    await initialization;

    expect(service.state()).toBe('error');
    expect(service.translations()).toEqual({});
    expect(service.errorMessage()).toBeTruthy();
  });

  it('retains valid translations after an HTTP error', async () => {
    const initialization = service.initialize();
    http.expectOne(`${environment.apiUrl}/i18n/PT_BR`).flush(pt);
    await initialization;

    const switching = service.setLanguage('EN_US');
    http.expectOne(`${environment.apiUrl}/i18n/EN_US`).flush('Unavailable', {
      status: 503,
      statusText: 'Service Unavailable',
    });
    await switching;

    expect(service.currentLang()).toBe('PT_BR');
    expect(service.translate('NAV_HOME')).toBe('Início');
    expect(service.state()).toBe('ready');
  });

  it('ignores an older response after a newer language choice succeeds', async () => {
    const initialization = service.initialize();
    http.expectOne(`${environment.apiUrl}/i18n/PT_BR`).flush(pt);
    await initialization;

    const enSwitch = service.setLanguage('EN_US');
    const ptSwitch = service.setLanguage('PT_BR');
    const enRequest = http.expectOne(`${environment.apiUrl}/i18n/EN_US`);
    const ptRequest = http.expectOne(`${environment.apiUrl}/i18n/PT_BR`);

    ptRequest.flush(pt);
    await ptSwitch;
    enRequest.flush(en);
    await enSwitch;

    expect(service.currentLang()).toBe('PT_BR');
    expect(service.translate('NAV_HOME')).toBe('Início');
  });

  it('keeps interpolation placeholders available to the pipe contract', async () => {
    const initialization = service.initialize();
    http.expectOne(`${environment.apiUrl}/i18n/PT_BR`).flush({ ...pt, GREETING: 'Olá, {0}' });
    await initialization;

    expect(service.translate('GREETING')).toBe('Olá, {0}');
  });
});
