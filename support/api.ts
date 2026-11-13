/**
 * API test support: the `api` fixture (support/fixtures.ts) is an ApiSession around
 * Playwright's `request` — no browser. Written by the JIRA agent's API mode; edit freely.
 *
 * Base URL: API_BASE_URL env var, else the QForge Demo Bank mock API.
 */
import { APIRequestContext, APIResponse } from '@playwright/test';

export const API_BASE_URL = (process.env.API_BASE_URL || 'https://qforge-prod.azurewebsites.net/mock/api/v1').replace(/\/+$/, '');

/** Absolute URL for a path such as "/accounts/1" (an absolute URL is returned unchanged). */
export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
}

/** Value at a dotted path such as "data[0].id", "meta.count" or "details[1].field". */
export function fieldAt(body: unknown, path: string): unknown {
  let current: unknown = body;
  for (const [, index, key] of path.matchAll(/\[(\d+)\]|([^.[\]]+)/g)) {
    if (current === null || current === undefined) return undefined;
    current = index !== undefined
      ? (current as unknown[])[Number(index)]
      : (current as Record<string, unknown>)[key];
  }
  return current;
}

/** One scenario's HTTP state: headers to send, and the last response. */
export class ApiSession {
  headers: Record<string, string> = { Accept: 'application/json' };
  response?: APIResponse;
  responseText?: string;
  responseBody?: unknown;
  responseMs?: number;

  constructor(readonly request: APIRequestContext) {}

  /** Field of the last JSON response at a dotted path. */
  field(path: string): unknown {
    return fieldAt(this.responseBody, path);
  }

  /** Status, URL and the start of the body: the message for a failed assertion. */
  describe(): string {
    return `${this.response?.status()} ${this.response?.url()}\n${(this.responseText || '').slice(0, 500)}`;
  }
}

/** Send a request with the scenario's headers and keep the response on the session. */
export async function sendRequest(
  api: ApiSession,
  method: string,
  path: string,
  body?: unknown,
): Promise<APIResponse> {
  const started = Date.now();
  const response = await api.request.fetch(apiUrl(path), {
    method: method.toUpperCase(),
    headers: api.headers,
    data: body,
  });
  api.responseText = await response.text();
  api.responseMs = Date.now() - started;
  api.response = response;
  try {
    api.responseBody = api.responseText ? JSON.parse(api.responseText) : undefined;
  } catch {
    api.responseBody = undefined;
  }
  return response;
}
