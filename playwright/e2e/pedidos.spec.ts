import { test, expect } from '@playwright/test';

//Padrão AAA conforme solicitado ao Gemini

test('Deve consultar um pedido aprovado', async ({ page }) => {
  // -------------------------------------------
  // 1. ARRANGE (Preparação)
  // -------------------------------------------
  const orderId = 'VLO-3QP5DT'; // Definimos a variável aqui para reutilizar
  
  // Acessar a aplicação
  await page.goto('http://localhost:5173/');
  
  // Garantir que a aplicação carregou antes de começar (Smoke test rápido)
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');


  // -------------------------------------------
  // 2. ACT (Ação)
  // -------------------------------------------
  // Navegar até a página de consulta
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  
  // Preencher o input com o ID que definimos no Arrange
  await page.getByTestId('search-order-id').fill(orderId);
  
  // Clicar no botão de buscar
  await page.getByTestId('search-order-button').click();


  // -------------------------------------------
  // 3. ASSERT (Validação)
  // -------------------------------------------
  // Verificar se estamos na página correta
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // Validar se o ID retornado é o mesmo que pesquisamos
  await expect(page.getByTestId('order-result-id')).toBeVisible();
  await expect(page.getByTestId('order-result-id')).toHaveText(orderId);

  // Validar se o status está correto
  await expect(page.getByTestId('order-result-status')).toBeVisible();
  await expect(page.getByTestId('order-result-status')).toHaveText('APROVADO');
});