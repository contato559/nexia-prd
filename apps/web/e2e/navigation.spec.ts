import { test, expect } from '@playwright/test';

test.describe('Navegação', () => {
  test('/ redireciona para /chat', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/chat/);
  });

  test('/chat carrega sem erros', async ({ page }) => {
    await page.goto('/chat');
    await expect(page).toHaveURL(/\/chat/);
    await expect(page.getByRole('heading', { name: 'Olá, Ana' })).toBeVisible();
  });
});
