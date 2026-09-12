import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectsFacade, type AdminProject } from './projects.facade';
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
