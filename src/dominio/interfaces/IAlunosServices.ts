import Usuario from "../../entidades/Usuario";
import { AtualizarAlunoDTO, CriarAlunoDTO, ObterDadosUsuarioDTO } from "../../infra/DTO/UsuarioDTO";

interface IAlunosServices {
    create(aluno: CriarAlunoDTO): Promise<CriarAlunoDTO | null>;
    update(id: number, aluno: AtualizarAlunoDTO): Promise<Usuario | null>;
    findById(id: number): Promise<ObterDadosUsuarioDTO | null>;
    findByEmail(email: string): Promise<ObterDadosUsuarioDTO | null>
}

export default IAlunosServices;