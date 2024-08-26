import Matriculas from "./Matriculas";


class Inscricoes extends Matriculas {
    data_inscricao: Date;

    constructor(id: number,id_aluno: number, id_curso: number, data_inscricao: Date) {
        super(id, id_aluno, id_curso);
        this.data_inscricao = data_inscricao;
    }
}

export default Inscricoes;