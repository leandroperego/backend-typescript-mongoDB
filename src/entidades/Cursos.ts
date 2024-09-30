

class Cursos {
    id: string;
    nome: string;
    descricao: string;
    capa: string;
    inscricoes: number;
    inicio: Date;

    constructor(id: string, nome: string, descricao: string, capa: string, inscricoes: number, inicio: Date) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.capa = capa;
        this.inscricoes = inscricoes;
        this.inicio = inicio;
    }
}

export default Cursos;