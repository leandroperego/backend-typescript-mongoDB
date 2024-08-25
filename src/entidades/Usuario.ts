

class Usuario {

    id: string;
    nome: string;
    email: string;
    senha: string;

    constructor(nome: string, email: string, senha: string) {
        this.id = Math.random().toString(36).substring(2); //TODO: GERAR ID AUTOMATICAMENTE 
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }
    
}

export default Usuario;