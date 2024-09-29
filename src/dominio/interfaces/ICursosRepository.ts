import { Request } from 'express';
import { ObterCursosDTO, ObterCursosInscricoesCancelamentosDTO } from '../../infra/DTO/CursosDTO';

interface IAlunosRepository {
    COLLECTION_NAME: string
    findAll(iniciados: boolean): Promise<ObterCursosDTO[]>
    findAllWithoutRegistration(id_user: number): Promise<ObterCursosDTO[]>
    findAllRegistration(id_user: number): Promise<ObterCursosInscricoesCancelamentosDTO[]>
    cursoByIdExists(id_curso: number): Promise<boolean>
    handleMatriculas(id_user: number, id_curso: number, req: Request): Promise<number>
}

export default IAlunosRepository;