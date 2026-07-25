export const API_VERSION = "v1";

/**
 * Base URL for fetch calls (includes version prefix).
 * - Dev with empty VITE_API_URL: `/api/v1` → Vite proxy → server
 * - Production: `https://your-api.com/api/v1`
 */
export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "");
  if (configured) return `${configured}/api/${API_VERSION}`;
  return `/api/${API_VERSION}`;
}
