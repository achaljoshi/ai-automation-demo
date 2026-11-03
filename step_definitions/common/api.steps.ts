/**
 * Generic HTTP steps shared by every API story. Written by the JIRA agent's API mode.
 * Story step files add only story-specific steps; never redefine these (Cucumber would
 * report the duplicate as ambiguous).
 */
import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { IApiWorld, fieldAt, sendRequest } from '../../support/api';

function field(world: IApiWorld, path: string): unknown {
  return fieldAt(world.responseBody, path);
}

function context(world: IApiWorld): string {
  return `${world.response?.status()} ${world.response?.url()}\n${(world.responseText || '').slice(0, 500)}`;
}

Given('the request header {string} is {string}', function (this: IApiWorld, name: string, value: string) {
  this.apiHeaders[name] = value;
});

Given('the request has no {string} header', function (this: IApiWorld, name: string) {
  delete this.apiHeaders[name];
});

When('I send a {word} request to {string}', async function (this: IApiWorld, method: string, path: string) {
  await sendRequest(this, method, path);
});

When(
  'I send a {word} request to {string} with the JSON body:',
  async function (this: IApiWorld, method: string, path: string, body: string) {
    await sendRequest(this, method, path, JSON.parse(body));
  },
);

Then('the response status should be {int}', function (this: IApiWorld, status: number) {
  expect(this.response?.status(), context(this)).toBe(status);
});

Then('the response header {string} should contain {string}', function (this: IApiWorld, name: string, value: string) {
  expect(this.response?.headers()[name.toLowerCase()] ?? '', context(this)).toContain(value);
});

Then('the response should be JSON', function (this: IApiWorld) {
  expect(this.response?.headers()['content-type'] ?? '', context(this)).toContain('application/json');
  expect(this.responseBody, context(this)).not.toBeUndefined();
});

Then('the response field {string} should be {string}', function (this: IApiWorld, path: string, value: string) {
  expect(String(field(this, path)), context(this)).toBe(value);
});

Then('the response field {string} should equal {float}', function (this: IApiWorld, path: string, value: number) {
  expect(Number(field(this, path)), context(this)).toBe(value);
});

Then('the response field {string} should be true', function (this: IApiWorld, path: string) {
  expect(field(this, path), context(this)).toBe(true);
});

Then('the response field {string} should be false', function (this: IApiWorld, path: string) {
  expect(field(this, path), context(this)).toBe(false);
});

Then('the response field {string} should exist', function (this: IApiWorld, path: string) {
  expect(field(this, path), context(this)).not.toBeUndefined();
});

Then('the response field {string} should not exist', function (this: IApiWorld, path: string) {
  expect(field(this, path), context(this)).toBeUndefined();
});

Then('the response field {string} should start with {string}', function (this: IApiWorld, path: string, prefix: string) {
  expect(String(field(this, path)), context(this)).toMatch(new RegExp('^' + prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

Then('the response field {string} should contain {string}', function (this: IApiWorld, path: string, text: string) {
  const value = field(this, path);
  if (Array.isArray(value)) {
    expect(value.map(String), context(this)).toContain(text);
  } else {
    expect(String(value), context(this)).toContain(text);
  }
});

Then('the response field {string} should have {int} item(s)', function (this: IApiWorld, path: string, count: number) {
  expect(field(this, path), context(this)).toHaveLength(count);
});

Then('every item in {string} should have the field {string}', function (this: IApiWorld, path: string, name: string) {
  const items = field(this, path) as unknown[];
  expect(Array.isArray(items), context(this)).toBe(true);
  for (const item of items) expect(fieldAt(item, name), context(this)).not.toBeUndefined();
});

Then(
  'every item in {string} should have {string} equal to {string}',
  function (this: IApiWorld, path: string, name: string, value: string) {
    const items = field(this, path) as unknown[];
    expect(Array.isArray(items), context(this)).toBe(true);
    for (const item of items) expect(String(fieldAt(item, name)), context(this)).toBe(value);
  },
);

Then('the response body should contain:', function (this: IApiWorld, expected: string) {
  expect(this.responseBody, context(this)).toMatchObject(JSON.parse(expected));
});

Then('the response time should be at least {int} ms', function (this: IApiWorld, ms: number) {
  expect(this.responseMs ?? 0).toBeGreaterThanOrEqual(ms);
});

Then('the response time should be at most {int} ms', function (this: IApiWorld, ms: number) {
  expect(this.responseMs ?? Infinity).toBeLessThanOrEqual(ms);
});
