/**
 * API base URL for fetch calls.
 * - Development (empty): uses `/api` → Vite proxy → localhost:5000
 * - Production: set VITE_API_URL to your hosted API origin
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");
  if (configured) return `${configured}/api`;
  return "/api";
}
