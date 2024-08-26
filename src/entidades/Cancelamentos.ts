import Matriculas from "./Matriculas";


class Cancelamentos extends Matriculas {
    data_cancelamento: Date;

    constructor(id: number, id_aluno: number, id_curso: number, data_cancelamento: Date) {
        super(id, id_aluno, id_curso);
        this.data_cancelamento = data_cancelamento;
    }
}

export default Cancelamentos;