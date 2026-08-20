// The web app is served from the same origin as the API, so a relative path is
// correct there and the dev server proxies `/api` through to Express. A native
// app has no origin to be relative to, so mobile calls `configureApi` once at
// startup with the address of the machine running the server.
let origin = '';

export function configureApi(baseUrl: string): void {
  // Trailing slashes would double up against the leading slash of every path.
  origin = baseUrl.replace(/\/+$/, '');
}

export function apiUrl(path: string): string {
  return `${origin}/api${path}`;
}
