import { test, expect } from '@playwright/test';

test.describe('Tela de Boas-vindas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
  });

  test('exibe saudação com nome do usuário', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Olá, Ana' })).toBeVisible();
  });

  test('exibe subtítulo orientando seleção de agente', async ({ page }) => {
    await expect(page.getByText('Selecione um agente para começar')).toBeVisible();
  });

  test('mostra 3 cards de agentes', async ({ page }) => {
    const agents = ['PRD Generator', 'Escopo Comercial', 'Escopo Técnico'];

    for (const name of agents) {
      await expect(page.getByRole('button', { name: new RegExp(name) })).toBeVisible();
    }
  });

  test('cards exibem descrição dos agentes', async ({ page }) => {
    await expect(page.getByText('Product Requirements Documents')).toBeVisible();
    await expect(page.getByText('propostas comerciais')).toBeVisible();
    await expect(page.getByText('documentação técnica')).toBeVisible();
  });

  test('clicar em agente abre o ChatContainer', async ({ page }) => {
    await page.getByRole('button', { name: /PRD Generator/ }).click();

    // ChatHeader deve aparecer com nome do agente
    await expect(page.locator('h2')).toContainText('PRD Generator');
    // Textarea de input deve estar visível
    await expect(page.getByPlaceholder('Descreva o que você precisa')).toBeVisible();
    // Saudação da WelcomeScreen não deve mais existir
    await expect(page.getByRole('heading', { name: 'Olá, Ana' })).not.toBeVisible();
  });

  test('clicar em cada agente mostra o agente correto', async ({ page }) => {
    // Testar Escopo Comercial
    await page.getByRole('button', { name: /Escopo Comercial/ }).click();
    await expect(page.locator('h2')).toContainText('Escopo Comercial');
  });
});
