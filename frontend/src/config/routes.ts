export const ROUTES = {
  HOME: '/',
  PROPERTIES: {
    LIST: '/',
    NEW: '/properties/new',
    DETAILS: (id: number | string) => `/properties/${id}`,
    EDIT: (id: number | string) => `/properties/${id}/edit`,
  },
} as const;

// Type helper for route parameters
export type RouteParams = {
  id?: string;
}; 