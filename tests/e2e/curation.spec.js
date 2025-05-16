import { test, expect } from '@playwright/test';

test.describe('Curation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('Joerg.Wehrenberg@gc-gruppe.de');
    await page.getByLabel('Password').fill('12345');
    await page.getByRole('button', { name: 'Sign in' }).click();
  });

  test('should create new curation', async ({ page }) => {
    await page.getByText('New Curation').click();
    await page.getByPlaceholder('Search for products...').fill('hammer');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.pi-star').first().click();
    await expect(page.getByText('Article has been pinned')).toBeVisible();
  });

  test('should pin KBNs', async ({ page }) => {
    await page.getByText('Pin KBNs').click();
    await page.getByLabel('Search Term').fill('test-kbns');
    await page.getByLabel('KBN List').fill('123456\n789012');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('KBNs have been saved')).toBeVisible();
  });

  test('should manage curations', async ({ page }) => {
    await page.getByText('Manage Curations').click();
    await page.getByPlaceholder('Search curations').fill('hammer');
    await expect(page.locator('.p-datatable-tbody tr')).toHaveCount(1);
    await page.locator('.pi-trash').first().click();
    await page.getByRole('button', { name: 'Delete Curation' }).click();
    await expect(page.getByText('Curation has been deleted')).toBeVisible();
  });

  test('should handle product visibility', async ({ page }) => {
    await page.getByText('New Curation').click();
    await page.getByPlaceholder('Search for products...').fill('hammer');
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Hide product
    await page.locator('.pi-eye').first().click();
    await expect(page.getByText('Article has been hidden')).toBeVisible();
    
    // Show product
    await page.locator('.pi-eye-slash').first().click();
    await expect(page.getByText('Article has been shown')).toBeVisible();
  });

  test('should validate KBN input', async ({ page }) => {
    await page.getByText('Pin KBNs').click();
    await page.getByRole('button', { name: 'Save' }).click();
    // Should not show success message without input
    await expect(page.getByText('KBNs have been saved')).not.toBeVisible();
  });

  test('should show creation date in manage view', async ({ page }) => {
    await page.getByText('Manage Curations').click();
    await expect(page.getByText(/Created .* days ago/)).toBeVisible();
  });

  test('should persist curation changes', async ({ page }) => {
    // Create curation
    await page.getByText('New Curation').click();
    await page.getByPlaceholder('Search for products...').fill('hammer');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.pi-star').first().click();
    
    // Verify in manage view
    await page.getByText('Manage Curations').click();
    await page.getByPlaceholder('Search curations').fill('hammer');
    await expect(page.locator('.p-datatable-tbody tr')).toHaveCount(1);
  });
});