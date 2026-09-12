import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TechnologiesFacade, type AdminTechnology } from './technologies.facade';
import { environment } from '../../../environments/environment';

describe('TechnologiesFacade', () => {
  let facade: TechnologiesFacade;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechnologiesFacade, provideHttpClient(), provideHttpClientTesting()],
    });

    facade = TestBed.inject(TechnologiesFacade);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should list technologies', () => {
    const mockTechs: AdminTechnology[] = [
      {
        id: '1',
        name: 'TypeScript',
        category: 'Language',
        proficiencyLevel: 95,
      },
    ];

    facade.list().subscribe((data) => {
      expect(data).toEqual(mockTechs);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/technologies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTechs);
  });

  it('should create a technology', () => {
    const payload = {
      name: 'NestJS',
      category: 'Backend',
      proficiencyLevel: 90,
    };

    const mockCreated: AdminTechnology = {
      id: '2',
      ...payload,
    };

    facade.create(payload).subscribe((data) => {
      expect(data).toEqual(mockCreated);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/technologies`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockCreated);
  });

  it('should update a technology', () => {
    const payload = { category: 'Language', proficiencyLevel: 98 };
    const mockUpdated: AdminTechnology = {
      id: '1',
      name: 'TypeScript',
      category: 'Language',
      proficiencyLevel: 98,
    };

    facade.update('1', payload).subscribe((data) => {
      expect(data).toEqual(mockUpdated);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/technologies/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUpdated);
  });

  it('should remove a technology', () => {
    facade.remove('1').subscribe();

    const req = httpTesting.expectOne(`${environment.apiUrl}/technologies/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
