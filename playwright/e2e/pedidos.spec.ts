import { test, expect } from '@playwright/test';

test('Deve consultar um pedido aprovado', async ({ page }) => {
  // -------------------------------------------
  // 1. ARRANGE (Preparação e Test Data)
  // -------------------------------------------
  const orderId = 'VLO-3QP5DT'; // Mantemos a sua variável!
  
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  // -------------------------------------------
  // 2. ACT (Ação)
  // -------------------------------------------
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  
  // Adicionamos a checagem extra do print aqui
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido'); 
  
  // Trocamos para os locators recomendados pelo Playwright (getByRole)
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderId);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // -------------------------------------------
  // 3. ASSERT (Validação)
  // -------------------------------------------
  
  // Pegamos a lógica inteligente de container do print, mas usando a sua variável
  const containerPedido = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..'); 

  // Valida o ID dentro do container com o timeout
  await expect(containerPedido).toContainText(orderId, { timeout: 10_000 });

  // Busca o status APROVADO
  await expect(page.getByText('APROVADO')).toBeVisible();
});