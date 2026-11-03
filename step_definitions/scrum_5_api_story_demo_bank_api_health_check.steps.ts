import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { IApiWorld } from '../support/api';

Then(
  'the Demo Bank health response header {string} should be {string}',
  function (this: IApiWorld, name: string, expectedValue: string) {
    expect(this.response, 'The Demo Bank health request should have received a response').toBeDefined();
    expect(
      this.response!.headers()[name.toLowerCase()],
      `Demo Bank health response header ${name} should equal ${expectedValue}`,
    ).toBe(expectedValue);
  },
);
