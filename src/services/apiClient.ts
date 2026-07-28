export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

/**
 * Custom fetch wrapper with dynamic API Base URL and x-user-id header
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}, userId?: string): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  if (userId) {
    headers.set('x-user-id', userId);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
