import { NotFoundException } from '@nestjs/common';
import { Prisma, Project } from '@prisma/client';
import { ProjectsService } from './projects.service';
import { IProjectsRepository } from './repositories/projects.repository.interface';

const project = (overrides: Partial<Project> = {}): Project => ({
  id: 'project-1',
  slug: 'project-one',
  title: 'Project One',
  description: 'Description',
  content: null,
  thumbnail: null,
  repositoryUrl: null,
  liveUrl: null,
  isActive: true,
  startDate: null,
  endDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('ProjectsService cache consistency', () => {
  const cache = { del: jest.fn().mockResolvedValue(undefined) };
  const repository = {
    findById: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as IProjectsRepository;
  let service: ProjectsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProjectsService(repository, cache);
  });

  it('invalidates only project representations after an update', async () => {
    const before = project();
    const after = project({ slug: 'project-updated', title: 'Updated' });
    repository.findById = jest.fn().mockResolvedValue(before);
    repository.update = jest.fn().mockResolvedValue(after);

    await service.update(before.id, { title: after.title, slug: after.slug });

    expect(cache.del).toHaveBeenCalledWith('/api/projects');
    expect(cache.del).toHaveBeenCalledWith('/api/projects/project-1');
    expect(cache.del).toHaveBeenCalledWith('/api/projects/slug/project-one');
    expect(cache.del).toHaveBeenCalledWith(
      '/api/projects/slug/project-updated',
    );
  });

  it('translates Prisma P2025 to 404 on a concurrent update race', async () => {
    repository.findById = jest.fn().mockResolvedValue(project());
    repository.update = jest.fn().mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('missing', {
        code: 'P2025',
        clientVersion: '6.19.3',
      }),
    );

    await expect(service.update('project-1', {})).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('translates Prisma P2025 to 404 on a concurrent delete race', async () => {
    repository.findById = jest.fn().mockResolvedValue(project());
    repository.delete = jest.fn().mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('missing', {
        code: 'P2025',
        clientVersion: '6.19.3',
      }),
    );

    await expect(service.remove('project-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
