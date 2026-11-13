/**
 * Generic HTTP steps shared by every API story. Written by the JIRA agent's API mode.
 * Story step files add only story-specific steps; never redefine these (playwright-bdd
 * rejects a step defined twice).
 */
import { expect } from '@playwright/test';
import { Given, Then, When } from '../../support/fixtures';
import { fieldAt, sendRequest } from '../../support/api';

Given('the request header {string} is {string}', async ({ api }, name: string, value: string) => {
  api.headers[name] = value;
});

Given('the request has no {string} header', async ({ api }, name: string) => {
  delete api.headers[name];
});

When('I send a {word} request to {string}', async ({ api }, method: string, path: string) => {
  await sendRequest(api, method, path);
});

When(
  'I send a {word} request to {string} with the JSON body:',
  async ({ api }, method: string, path: string, body: string) => {
    await sendRequest(api, method, path, JSON.parse(body));
  },
);

Then('the response status should be {int}', async ({ api }, status: number) => {
  expect(api.response?.status(), api.describe()).toBe(status);
});

Then('the response header {string} should contain {string}', async ({ api }, name: string, value: string) => {
  expect(api.response?.headers()[name.toLowerCase()] ?? '', api.describe()).toContain(value);
});

Then('the response should be JSON', async ({ api }) => {
  expect(api.response?.headers()['content-type'] ?? '', api.describe()).toContain('application/json');
  expect(api.responseBody, api.describe()).not.toBeUndefined();
});

Then('the response field {string} should be {string}', async ({ api }, path: string, value: string) => {
  expect(String(api.field(path)), api.describe()).toBe(value);
});

Then('the response field {string} should equal {float}', async ({ api }, path: string, value: number) => {
  expect(Number(api.field(path)), api.describe()).toBe(value);
});

Then('the response field {string} should be true', async ({ api }, path: string) => {
  expect(api.field(path), api.describe()).toBe(true);
});

Then('the response field {string} should be false', async ({ api }, path: string) => {
  expect(api.field(path), api.describe()).toBe(false);
});

Then('the response field {string} should exist', async ({ api }, path: string) => {
  expect(api.field(path), api.describe()).not.toBeUndefined();
});

Then('the response field {string} should not exist', async ({ api }, path: string) => {
  expect(api.field(path), api.describe()).toBeUndefined();
});

Then('the response field {string} should start with {string}', async ({ api }, path: string, prefix: string) => {
  expect(String(api.field(path)), api.describe()).toMatch(new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

Then('the response field {string} should contain {string}', async ({ api }, path: string, text: string) => {
  const value = api.field(path);
  if (Array.isArray(value)) {
    expect(value.map(String), api.describe()).toContain(text);
  } else {
    expect(String(value), api.describe()).toContain(text);
  }
});

Then('the response field {string} should have {int} item(s)', async ({ api }, path: string, count: number) => {
  expect(api.field(path), api.describe()).toHaveLength(count);
});

Then('every item in {string} should have the field {string}', async ({ api }, path: string, name: string) => {
  const items = api.field(path) as unknown[];
  expect(Array.isArray(items), api.describe()).toBe(true);
  for (const item of items) expect(fieldAt(item, name), api.describe()).not.toBeUndefined();
});

Then(
  'every item in {string} should have {string} equal to {string}',
  async ({ api }, path: string, name: string, value: string) => {
    const items = api.field(path) as unknown[];
    expect(Array.isArray(items), api.describe()).toBe(true);
    for (const item of items) expect(String(fieldAt(item, name)), api.describe()).toBe(value);
  },
);

Then('the response body should contain:', async ({ api }, expected: string) => {
  expect(api.responseBody, api.describe()).toMatchObject(JSON.parse(expected));
});

Then('the response time should be at least {int} ms', async ({ api }, ms: number) => {
  expect(api.responseMs ?? 0).toBeGreaterThanOrEqual(ms);
});

Then('the response time should be at most {int} ms', async ({ api }, ms: number) => {
  expect(api.responseMs ?? Infinity).toBeLessThanOrEqual(ms);
});
