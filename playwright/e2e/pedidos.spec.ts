// Importa as funções principais do Playwright: 'test' (para criar o bloco de teste) e 'expect' (para fazer as validações/afirmações).
import { test, expect } from '@playwright/test';

// Declara o teste e dá um título a ele. A função é 'async' (assíncrona) e recebe o objeto 'page', que representa a aba do navegador.
test('Deve consultar um pedido aprovado', async ({ page }) => {
  
  // -------------------------------------------
  // 1. ARRANGE (Preparação e Test Data)
  // -------------------------------------------
  
  // Cria uma constante (variável que não muda) guardando o código do pedido. Isso facilita a reutilização em várias partes do teste.
  const orderId = 'VLO-3QP5DT'; 
  
  // Instrui o navegador a acessar a URL base da sua aplicação local (onde o frontend está rodando).
  await page.goto('http://localhost:5173/');
  
  // "Smoke Test": Valida se o título principal dentro da seção 'hero-section' contém o texto 'Velô Sprint', garantindo que a home carregou antes de prosseguir.
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');


  // -------------------------------------------
  // 2. ACT (Ação do Usuário)
  // -------------------------------------------
  
  // Localiza na tela um elemento do tipo link que tenha o texto 'Consultar Pedido' e simula o clique do usuário.
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  
  // Checagem de segurança: Valida se a navegação funcionou verificando se a nova tela possui um cabeçalho contendo o texto 'Consultar Pedido'.
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido'); 
  
  // Localiza a caixa de texto (input) acessível pelo nome 'Número do Pedido' e preenche ela automaticamente com o valor da nossa variável 'orderId'.
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderId);
  
  // Localiza o botão de submissão acessível pelo nome 'Buscar Pedido' e clica nele para disparar a pesquisa.
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // -------------------------------------------
  // 3. ASSERT (Validações do Resultado)
  // -------------------------------------------
  
  // Estratégia de localização avançada: Procura um parágrafo com a palavra exata "Pedido" e usa o `.locator('..')` para subir um nível no HTML, mapeando a "div" pai que agrupa o rótulo e o valor.
  const containerPedido = page.getByRole('paragraph')
    .filter({ hasText: /^Pedido$/ })
    .locator('..'); 

  // Valida se dentro da "div" mapeada acima (containerPedido) aparece o texto da nossa variável. Dá um prazo extra de 10 segundos (timeout) para aguardar o retorno da API/banco de dados.
  await expect(containerPedido).toContainText(orderId, { timeout: 10_000 });

  // Valida se a palavra 'APROVADO' está visível na tela, confirmando que o sistema trouxe o status correto daquele pedido.
  await expect(page.getByText('APROVADO')).toBeVisible();

}); // Fecha o bloco do teste
  
// -------------------------------------------
// DECLARAÇÃO DO TESTE
// -------------------------------------------
// Declara o cenário de teste com um título claro. A função assíncrona (async) recebe o objeto 'page', que controla a aba do navegador.
test('Deve exibir erro ao consultar um pedido inexistente', async ({ page }) => {
  
  // -------------------------------------------
  // 1. ARRANGE (Preparação e Test Data)
  // -------------------------------------------
  
  // Cria uma constante com um ID de pedido propositalmente inválido para usarmos no teste.
  const invalidOrderId = 'rtetwet'; 
  
  // Instrui o navegador a acessar a URL inicial da aplicação (note que o Codegen capturou a porta 5174 neste teste).
  await page.goto('http://localhost:5174/');


  // -------------------------------------------
  // 2. ACT (Ação do Usuário)
  // -------------------------------------------
  
  // Localiza o link no menu lateral ou superior com o texto 'Consultar Pedido' e simula o clique para trocar de tela.
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  
  // Localiza o campo de busca através do 'data-testid' (uma excelente prática de desenvolvimento) e preenche com a nossa variável inválida.
  await page.getByTestId('search-order-id').fill(invalidOrderId);
  
  // Localiza o botão de buscar pelo 'data-testid' e clica nele para submeter o formulário de pesquisa.
  await page.getByTestId('search-order-button').click();


  // -------------------------------------------
  // 3. ASSERT (Validações do Resultado)
  // -------------------------------------------
  
  // Em vez de buscar no '#root' (a página toda), procura o texto exato da mensagem de erro e exige que ele esteja visível na tela naquele momento.
  await expect(page.getByText('Pedido não encontrado', { exact: true })).toBeVisible();
  
  // Faz a mesma validação rígida para a frase de instrução secundária, garantindo que o feedback completo foi dado ao usuário.
  await expect(page.getByText('Verifique o número do pedido e tente novamente', { exact: true })).toBeVisible();

}); // Fecha o bloco do teste
