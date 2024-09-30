import { inject, injectable } from "inversify";
import { ObterCursosDTO } from "../../infra/DTO/CursosDTO";
import { ObterIdUsuarioDTO } from "../../infra/DTO/UsuarioDTO";
import CustomRequest from "../interfaces/CustomRequest";
import ICursosRepository from "../interfaces/ICursosRepository";
import ICursosServices from "../interfaces/ICursosServices";

@injectable()
class CursosServices implements ICursosServices {

    constructor(
        @inject('ICursosRepository') private readonly cursosRepository: ICursosRepository
    ) { }

     findAll = async(user: ObterIdUsuarioDTO | undefined): Promise<ObterCursosDTO[]> => {

        let cursos: ObterCursosDTO[] = [];

        if (!user) {
            cursos = await this.cursosRepository.findAll(false);
        } else {
            cursos = await this.cursosRepository.findAllWithoutRegistration(user.id);
        }

        return cursos;
    }

     handleMatriculas = async(userId: string, cursoId: string, req: CustomRequest): Promise<number> => {
        const cursoExiste: boolean = await this.cursosRepository.cursoByIdExists(cursoId);

        if (!cursoExiste) {
            throw new Error('Curso não encontrado.');
        }

        let result: number | null = null;

        try {
            result = await this.cursosRepository.handleMatriculas(userId, cursoId, req) as number;
        } catch (error) {
            throw new Error('Erro na matricula.');
            // status 500 no tratamento de erro
        }

        return result;
    }

}

export default CursosServices;