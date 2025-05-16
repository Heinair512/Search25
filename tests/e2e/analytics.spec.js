import { test, expect } from '@playwright/test';

test.describe('Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email').fill('Joerg.Wehrenberg@gc-gruppe.de');
    await page.getByLabel('Password').fill('12345');
    await page.getByRole('button', { name: 'Sign in' }).click();
  });

  test('should show analytics dashboard', async ({ page }) => {
    await expect(page.getByText('Analytics Dashboard')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should filter by business unit', async ({ page }) => {
    await page.getByRole('button', { name: 'Business Unit' }).click();
    await page.getByText('Search').click();
    await expect(page.locator('.p-datatable')).toBeVisible();
  });

  test('should navigate to detailed views', async ({ page }) => {
    await page.getByText('Zero Result Searches').click();
    await expect(page).toHaveURL(/.*analytics\/no-results/);
    
    await page.getByText('Low Click Searches').click();
    await expect(page).toHaveURL(/.*analytics\/low-clicks/);
    
    await page.getByText('Top Clicked Searches').click();
    await expect(page).toHaveURL(/.*analytics\/top-clicked/);
  });

  test('should export data', async ({ page }) => {
    await page.goto('/dashboard/analytics/no-results');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('no-result-searches-GC Gruppe.csv');
  });

  test('should update metrics when changing date range', async ({ page }) => {
    await page.locator('.p-calendar').click();
    await page.getByText('15').first().click();
    await page.getByText('20').first().click();
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should toggle metric visibility', async ({ page }) => {
    await page.getByLabel('MRR').click();
    await page.getByLabel('NDCG').click();
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should show correct data in tables', async ({ page }) => {
    // Check Zero Result Searches
    await page.goto('/dashboard/analytics/no-results');
    await expect(page.locator('.p-datatable-tbody tr')).toHaveCount(10);
    
    // Check search functionality
    await page.getByPlaceholder('Suchbegriff filtern...').fill('ev');
    await expect(page.locator('.p-datatable-tbody tr')).toHaveCount(1);
  });

  test('should handle sorting in tables', async ({ page }) => {
    await page.goto('/dashboard/analytics/top-clicked');
    
    // Sort by clicks
    await page.getByText('Clicks').click();
    await expect(page.locator('.p-datatable-tbody tr')).toBeVisible();
    
    // Sort by position
    await page.getByText('Pos').click();
    await expect(page.locator('.p-datatable-tbody tr')).toBeVisible();
  });
});