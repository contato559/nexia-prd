import { test, expect, type Route } from '@playwright/test';

// Helper: monta resposta SSE simulada
function buildSSE(tokens: string[], assistantMessageId = 'mock-assistant-1') {
  const lines: string[] = [];
  lines.push(`data: ${JSON.stringify({ type: 'user_message', id: 'mock-user-1' })}\n\n`);
  for (const token of tokens) {
    lines.push(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`);
  }
  lines.push(`data: ${JSON.stringify({ type: 'complete', assistantMessageId })}\n\n`);
  return lines.join('');
}

// Helper: intercepta a chamada SSE de mensagens e responde com mock
async function mockSSEResponse(route: Route, tokens: string[]) {
  const body = buildSSE(tokens);
  await route.fulfill({
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
    body,
  });
}

test.describe('Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
    // Selecionar agente PRD Generator para entrar no chat
    await page.getByRole('button', { name: /PRD Generator/ }).click();
    await expect(page.locator('h2')).toContainText('PRD Generator');
  });

  test('exibe header com nome e descrição do agente', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('PRD Generator');
    const header = page.locator('header');
    await expect(header.getByText('Product Requirements Documents')).toBeVisible();
  });

  test('exibe botão de exportar', async ({ page }) => {
    await expect(page.getByText('Exportar')).toBeVisible();
  });

  test('exibe textarea para input de mensagem', async ({ page }) => {
    const textarea = page.getByPlaceholder('Descreva o que você precisa');
    await expect(textarea).toBeVisible();
    await expect(textarea).toBeEnabled();
  });

  test('botão de enviar desabilitado quando textarea vazia', async ({ page }) => {
    const inputArea = page.locator('.border-t');
    const sendButton = inputArea.locator('button');
    await expect(sendButton).toBeDisabled();
  });

  test('botão de enviar habilitado quando há texto', async ({ page }) => {
    const textarea = page.getByPlaceholder('Descreva o que você precisa');
    await textarea.fill('Olá, preciso de um PRD');

    const inputArea = page.locator('.border-t');
    const sendButton = inputArea.locator('button');
    await expect(sendButton).toBeEnabled();
  });

  test('enviar mensagem exibe na lista de mensagens', async ({ page }) => {
    // Mock da resposta SSE
    await page.route('**/conversations/*/messages', (route) =>
      mockSSEResponse(route, ['Olá! ', 'Como posso ', 'ajudar?'])
    );

    const textarea = page.getByPlaceholder('Descreva o que você precisa');
    await textarea.fill('Preciso de um PRD para um app de delivery');
    await textarea.press('Enter');

    // Mensagem do usuário deve aparecer
    await expect(page.getByText('Preciso de um PRD para um app de delivery')).toBeVisible();
  });

  test('resposta do assistente aparece após streaming SSE', async ({ page }) => {
    await page.route('**/conversations/*/messages', (route) =>
      mockSSEResponse(route, ['Claro! ', 'Vou criar ', 'o PRD.'])
    );

    const textarea = page.getByPlaceholder('Descreva o que você precisa');
    await textarea.fill('Crie um PRD');
    await textarea.press('Enter');

    // Resposta completa do assistente
    await expect(page.getByText('Claro! Vou criar o PRD.')).toBeVisible({ timeout: 5000 });
  });

  test('textarea limpa após envio', async ({ page }) => {
    await page.route('**/conversations/*/messages', (route) =>
      mockSSEResponse(route, ['Ok!'])
    );

    const textarea = page.getByPlaceholder('Descreva o que você precisa');
    await textarea.fill('Minha mensagem');
    await textarea.press('Enter');

    await expect(textarea).toHaveValue('');
  });

  test('mensagem de erro quando API retorna erro', async ({ page }) => {
    await page.route('**/conversations/*/messages', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'Erro interno' }),
      })
    );

    const textarea = page.getByPlaceholder('Descreva o que você precisa');
    await textarea.fill('Teste de erro');
    await textarea.press('Enter');

    // Mensagem de erro do assistente (tratamento de response.ok === false)
    await expect(
      page.getByText('Desculpe, ocorreu um erro ao processar sua mensagem')
    ).toBeVisible({ timeout: 5000 });
  });
});
