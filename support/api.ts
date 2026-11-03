/**
 * API test support — scenarios tagged @api get `this.api` (a Playwright APIRequestContext)
 * instead of a browser. Written by the JIRA agent's API mode; edit freely.
 *
 * Base URL: API_BASE_URL env var, else the QForge Demo Bank mock API.
 */
import { After, Before } from '@cucumber/cucumber';
import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { ICustomWorld } from './world';

/** The world as seen by @api steps: `this: IApiWorld`. */
export interface IApiWorld extends ICustomWorld {
  api: APIRequestContext;
  apiHeaders: Record<string, string>;
  response?: APIResponse;
  responseText?: string;
  responseBody?: unknown;
  responseMs?: number;
}

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

/** Send a request with the scenario's headers and keep the response on the world. */
export async function sendRequest(
  world: IApiWorld,
  method: string,
  path: string,
  body?: unknown,
): Promise<APIResponse> {
  const started = Date.now();
  const response = await world.api.fetch(apiUrl(path), {
    method: method.toUpperCase(),
    headers: world.apiHeaders,
    data: body,
  });
  world.responseText = await response.text();
  world.responseMs = Date.now() - started;
  world.response = response;
  try {
    world.responseBody = world.responseText ? JSON.parse(world.responseText) : undefined;
  } catch {
    world.responseBody = undefined;
  }
  return response;
}

Before({ tags: '@api' }, async function (this: IApiWorld) {
  this.apiHeaders = { Accept: 'application/json' };
  this.api = await request.newContext();
});

After({ tags: '@api' }, async function (this: IApiWorld) {
  await this.api?.dispose();
});
