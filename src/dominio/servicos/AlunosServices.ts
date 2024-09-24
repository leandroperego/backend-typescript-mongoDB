import Usuario from "../../entidades/Usuario";
import { ObterDadosUsuarioDTO, CriarAlunoDTO, AtualizarAlunoDTO } from "../../infra/DTO/UsuarioDTO";
import IAlunosServices from "../interfaces/IAlunosServices";
import IAlunosRepository from "../interfaces/IAlunosRepository";

class AlunosServices implements IAlunosServices {

    constructor(
        private alunosRepository: IAlunosRepository
    ) { }
    
    async create(aluno: CriarAlunoDTO): Promise<CriarAlunoDTO | null> {

        if (await this.emailExist(aluno.email)) {
            throw new Error("Não é possivel cadastrar esse e-mail. Email já está em uso.");
        }

        const result = await this.alunosRepository.create({ nome: aluno.nome, email: aluno.email, senha: aluno.senha });

        if (!result) {
            throw new Error("Erro ao criar Aluno.");
        }

        return result;
    }

    async update(id: number, aluno: AtualizarAlunoDTO): Promise<Usuario | null> {
        const result = await this.findById(Number(id));

        if (!result) {
            throw new Error("Aluno não encontrado.");
        }

        const resultUpdate = await this.alunosRepository.update(Number(id), { ...result, ...aluno });

        if (!resultUpdate) {
            throw new Error("Erro ao atualizar Aluno.");
        }

        return resultUpdate;

    }

    async findById(id: number): Promise<ObterDadosUsuarioDTO | null> {
        const result = await this.alunosRepository.findById(Number(id));
        if (!result) {
            return null;
        }
        return result;
    }

    async findByEmail(email: string): Promise<ObterDadosUsuarioDTO | null> {
        const result = await this.alunosRepository.findByEmail(email);

        if (!result) {
            return null;
        }

        return result;
    }

    private async emailExist(email: string): Promise<boolean> {
        const result: ObterDadosUsuarioDTO | null = await this.findByEmail(email);
        
        return result ? true : false;
    }

}

export default AlunosServices;