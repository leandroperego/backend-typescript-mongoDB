
class Usuario {

    id: string;
    nome: string;
    email: string;
    senha: string; //TODO: Inserir dados de login em outra classe

    constructor(id: string, nome: string, email: string, senha: string) {

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }
    
}

export default Usuario;