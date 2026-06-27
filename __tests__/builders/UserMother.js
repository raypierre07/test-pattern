import { User } from '../../src/domain/User.js';

export class UserMother {
  static umUsuarioPadrao() {
    return new User('Joao Silva', 'joao@email.com', 'STANDARD');
  }

  static umUsuarioPremium() {
    // Criamos o usuário. O terceiro parâmetro 'PREMIUM' é o que ativa o desconto.
    const user = new User('Maria Premium', 'maria@email.com', 'PREMIUM');
    
    // Reforço de segurança: Algumas versões da classe podem usar 'tipo' ou 'type'
    user.tipo = 'PREMIUM';
    user.type = 'PREMIUM';
    
    return user;
  }
}
