import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectsFacade, type AdminProject, type ProjectPage } from './projects.facade';
import { environment } from '../../../environments/environment';

describe('ProjectsFacade', () => {
  let facade: ProjectsFacade;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsFacade, provideHttpClient(), provideHttpClientTesting()],
    });

    facade = TestBed.inject(ProjectsFacade);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should list projects', () => {
    const mockProjects: AdminProject[] = [
      {
        id: '1',
        title: 'Project 1',
        slug: 'project-1',
        description: 'Test project',
        technologies: [{ name: 'NestJS' }],
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];

    facade.list().subscribe((data) => {
      expect(data).toEqual(mockProjects);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);
  });

  it('should create a project', () => {
    const payload = {
      title: 'New Project',
      slug: 'new-project',
      description: 'New Description',
      isActive: true,
      technologyIds: ['tech-1'],
    };

    const mockCreated: AdminProject = {
      id: '2',
      title: payload.title,
      slug: payload.slug,
      description: payload.description,
      technologies: [{ name: 'Angular' }],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    facade.create(payload).subscribe((data) => {
      expect(data).toEqual(mockCreated);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockCreated);
  });

  it('should request a paginated project page', () => {
    const page: ProjectPage = {
      items: [],
      total: 0,
      page: 2,
      limit: 10,
      totalPages: 0,
    };

    facade.listPage(2, 10).subscribe((data) => expect(data).toEqual(page));

    const req = httpTesting.expectOne(
      (request) => request.url === `${environment.apiUrl}/projects/page`,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(page);
  });

  it('should update a project', () => {
    const payload = { title: 'Updated Project', isActive: true };
    const mockUpdated: AdminProject = {
      id: '1',
      title: 'Updated Project',
      slug: 'project-1',
      description: 'Test project',
      technologies: [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    facade.update('1', payload).subscribe((data) => {
      expect(data).toEqual(mockUpdated);
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}/projects/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUpdated);
  });

  it('should remove a project', () => {
    facade.remove('1').subscribe();

    const req = httpTesting.expectOne(`${environment.apiUrl}/projects/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
