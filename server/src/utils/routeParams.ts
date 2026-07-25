/** Express 5 types allow route params to be string | string[]; normalize to string. */
export function getRouteParam(
  params: Record<string, string | string[]>,
  key: string,
): string {
  const value = params[key];
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}
