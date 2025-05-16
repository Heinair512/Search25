import { test, expect } from '@playwright/test';

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('Joerg.Wehrenberg@gc-gruppe.de');
    await page.getByLabel('Password').fill('12345');
    await page.getByRole('button', { name: 'Sign in' }).click();
  });

  test('should update profile', async ({ page }) => {
    await page.getByText('Profile').click();
    await page.getByLabel('Name').clear();
    await page.getByLabel('Name').fill('Updated Name');
    await page.getByLabel('New Password').fill('newpassword');
    await page.getByLabel('Confirm Password').fill('newpassword');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Your changes have been saved')).toBeVisible();
  });

  test('should show password mismatch error', async ({ page }) => {
    await page.getByText('Profile').click();
    await page.getByLabel('New Password').fill('password1');
    await page.getByLabel('Confirm Password').fill('password2');
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });
});