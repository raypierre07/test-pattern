import { jest } from '@jest/globals';
import { CheckoutService } from '../src/services/CheckoutService.js';
import { UserMother } from './builders/UserMother.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { Item } from '../src/domain/Item.js';

describe('CheckoutService', () => {
  let checkoutService, gatewayStub, repositoryStub, emailMock;

  beforeEach(() => {
    gatewayStub = { cobrar: jest.fn() };
    repositoryStub = { salvar: jest.fn().mockResolvedValue({ id: 'pedido-123' }) };
    emailMock = { enviarEmail: jest.fn().mockResolvedValue(true) };

    checkoutService = new CheckoutService(gatewayStub, repositoryStub, emailMock);
  });

  describe('Cenário: Pagamento Recusado (Verificação de Estado)', () => {
    test('deve retornar null se o gateway de pagamento falhar', async () => {
      const carrinho = new CarrinhoBuilder().build();
      gatewayStub.cobrar.mockResolvedValue({ success: false });

      const resultado = await checkoutService.processarPedido(carrinho);

      expect(resultado).toBeNull();
    });
  });

  describe('Cenário: Sucesso Cliente Premium (Verificação de Comportamento)', () => {
    test('deve aplicar 10% de desconto e disparar e-mail de confirmação', async () => {
      // 1. Arrange
      const usuarioPremium = UserMother.umUsuarioPremium();
      const carrinho = new CarrinhoBuilder()
        .comUser(usuarioPremium)
        .comItens([
          new Item('Produto A', 100),
          new Item('Produto B', 100)
        ])
        .build();

      gatewayStub.cobrar.mockResolvedValue({ success: true });

      // 2. Act
      await checkoutService.processarPedido(carrinho);

      // 3. Assert
      
      // Validação do Dinheiro (180)
      const valorCobrado = gatewayStub.cobrar.mock.calls[0][0];
      expect(valorCobrado).toBe(180);

      // Validação do E-mail
      // O serviço envia 3 argumentos: email, assunto e corpo da mensagem.
      // Usamos expect.anything() para o terceiro argumento para não dar erro de contagem.
      expect(emailMock.enviarEmail).toHaveBeenCalledWith(
        usuarioPremium.email,
        expect.stringContaining('Aprovado'),
        expect.anything() 
      );
    });
  });
});
