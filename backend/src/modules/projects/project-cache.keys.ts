export const projectCacheKeys = {
  list: '/api/projects',
  byId: (id: string) => `/api/projects/${id}`,
  bySlug: (slug: string) => `/api/projects/slug/${slug}`,
} as const;
