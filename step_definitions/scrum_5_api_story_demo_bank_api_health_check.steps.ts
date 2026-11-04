import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { IApiWorld } from '../support/api';

Then(
  'the Demo Bank health response header {string} should be exactly {string}',
  function (this: IApiWorld, name: string, expectedValue: string) {
    expect(this.response, 'A health response should exist before checking its headers').toBeDefined();
    const actualValue = this.response!.headers()[name.toLowerCase()];
    expect(actualValue, `Demo Bank health response header "${name}" should equal "${expectedValue}"`).toBe(expectedValue);
  },
);
