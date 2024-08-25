

abstract class Matriculas {

    id: string;
    id_aluno: string;
    id_curso: string;

    constructor(id_aluno: string, id_curso: string) {
        this.id = Math.random().toString(36).substring(2);
        this.id_aluno = id_aluno;
        this.id_curso = id_curso;
    }
}

export default Matriculas;