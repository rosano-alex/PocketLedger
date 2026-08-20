import type { ApiResponse } from '../responses';
import { apiUrl } from './config';

// Resolves to the envelope, not to "success" — a refusal is a real answer and
// the caller decides what to do with it.
export async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(apiUrl(path), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  }).catch(() => {
    throw new Error("Can't reach the server.");
  });


  const body = (await response.json()) as ApiResponse<T>;

  // A 500 is the server failng; a refusal comes back as 200 with ok: false.
  if (response.status >= 500) {
    throw new Error(body.ok ? 'Something went wrong.' : body.error.message);
  }

  return body;
}

// for reads there's nothing to decide - anything but data is an error
export async function read<T>(path: string): Promise<T> {
  const result = await request<T>(path);
  if (!result.ok) throw new Error(result.error.message);
  return result.data;
}
