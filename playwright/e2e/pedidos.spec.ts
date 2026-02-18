
import { test, expect } from '@playwright/test';

// AAA - Arrange, Act, Assert 
// Ou: PAV Preparar, Agir Validar

test('Deve consultar um pedido aprovado', async ({ page }) => {
  // 1. Acessar a Home
  await page.goto('http://localhost:5173/');

  // Checkpoint: Verificar se estamos na Home (título Velô Sprint)
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  // 2. Navegar para a página de Consulta
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();

  // Checkpoint: Verificar se carregou a página de consulta
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // 3. Preencher o ID e Pesquisar
  await page.getByTestId('search-order-id').fill('VLO-3QP5DT');
  await page.getByRole('button', { name: 'Buscar' }).click(); // Ajustei para ser mais genérico ou use o ID se preferir

  // 4. Validar o Resultado
  await expect(page.getByTestId('order-result-id')).toBeVisible();
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-3QP5DT');
  
  await expect(page.getByTestId('order-result-status')).toBeVisible();
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
});