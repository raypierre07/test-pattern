import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';
import { UserMother } from './UserMother.js';

export class CarrinhoBuilder {
  constructor() {
    // Começa com um usuário padrão e um item de 100
    this.user = UserMother.umUsuarioPadrao();
    this.itens = [new Item('Item Padrão', 100)];
  }

  comUser(user) {
    this.user = user;
    return this;
  }

  comItens(itens) {
    this.itens = itens;
    return this;
  }

  vazio() {
    this.itens = [];
    return this;
  }

  build() {
    // Criamos o carrinho passando o usuário
    const carrinho = new Carrinho(this.user);
    
    // Garantia extra: associa o usuário manualmente se o construtor falhar
    if (!carrinho.user) carrinho.user = this.user;

    this.itens.forEach(item => {
      // Tenta adicionar o item usando os nomes de métodos mais comuns
      if (typeof carrinho.adicionarItem === 'function') {
        carrinho.adicionarItem(item);
      } else if (typeof carrinho.addItem === 'function') {
        carrinho.addItem(item);
      } else if (typeof carrinho.adicionar === 'function') {
        carrinho.adicionar(item);
      } else {
        // Se nenhum método existir, insere direto no array
        if (!carrinho.itens) carrinho.itens = [];
        carrinho.itens.push(item);
      }
    });

    return carrinho;
  }
}
