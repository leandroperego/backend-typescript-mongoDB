import Matriculas from "./Matriculas";


class Inscricoes extends Matriculas {
    data_inscricao: Date;

    constructor(id: string,id_aluno: string, id_curso: string, data_inscricao: Date) {
        super(id, id_aluno, id_curso);
        this.data_inscricao = data_inscricao;
    }
}

export default Inscricoes;