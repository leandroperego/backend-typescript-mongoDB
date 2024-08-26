

abstract class Matriculas {

    id: number;
    id_aluno: number;
    id_curso: number;

    constructor(id: number, id_aluno: number, id_curso: number) {
        this.id = id;
        this.id_aluno = id_aluno;
        this.id_curso = id_curso;
    }
}

export default Matriculas;