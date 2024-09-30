import { AtualizarAlunoDTO, CriarAlunoDTO, ObterDadosUsuarioDTO } from "../../infra/DTO/UsuarioDTO";
import Usuario from "../../entidades/Usuario";

interface IAlunosRepository {
    findByEmail(email: string): Promise<ObterDadosUsuarioDTO | null>;
    findById(id: string): Promise<ObterDadosUsuarioDTO | null>;
    create(aluno: CriarAlunoDTO): Promise<CriarAlunoDTO | null>;
    update(id: string, aluno: AtualizarAlunoDTO): Promise<Usuario | null>;
}

export default IAlunosRepository;