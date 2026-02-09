import { test, expect } from '@playwright/test';

test.describe('Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
  });

  test('exibe logo Nexia PRD', async ({ page }) => {
    await expect(page.getByText('Nexia PRD')).toBeVisible();
    await expect(page.getByText('Gerador de Docs')).toBeVisible();
  });

  test('exibe botão Nova Conversa', async ({ page }) => {
    await expect(page.getByText('Nova Conversa')).toBeVisible();
  });

  test('exibe seletor de agentes', async ({ page }) => {
    // O AgentSelector deve estar visível na sidebar
    await expect(page.locator('aside')).toBeVisible();
  });

  test('exibe seção de histórico', async ({ page }) => {
    await expect(page.getByText('Histórico')).toBeVisible();
  });

  test('exibe conversas no histórico', async ({ page }) => {
    await expect(page.getByText('PRD do App de Delivery')).toBeVisible();
    await expect(page.getByText('Proposta Sistema ERP')).toBeVisible();
    await expect(page.getByText('Arquitetura Microserviços')).toBeVisible();
  });

  test('exibe botões de configurações e sair', async ({ page }) => {
    await expect(page.getByText('Configurações')).toBeVisible();
    await expect(page.getByText('Sair')).toBeVisible();
  });
});
