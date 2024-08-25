

class Cursos {
    id: string;
    nome: string;
    descricao: string;
    capa: string;
    inscricoes: number;
    inicio: Date;

    constructor(nome: string, descricao: string, capa: string, inscricoes: number, inicio: Date) {
        this.id = Math.random().toString(36).substring(2)
        this.nome = nome
        this.descricao = descricao
        this.capa = capa
        this.inscricoes = inscricoes
        this.inicio = inicio
    }
}

export default Cursos;