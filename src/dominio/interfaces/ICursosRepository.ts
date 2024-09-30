import { Request } from 'express';
import { ObterCursosDTO, ObterCursosInscricoesCancelamentosDTO } from '../../infra/DTO/CursosDTO';

interface IAlunosRepository {
    COLLECTION_NAME: string
    findAll(iniciados: boolean): Promise<ObterCursosDTO[]>
    findAllWithoutRegistration(id_user: string): Promise<ObterCursosDTO[]>
    findAllRegistration(id_user: string): Promise<ObterCursosInscricoesCancelamentosDTO[]>
    cursoByIdExists(id_curso: string): Promise<boolean>
    handleMatriculas(id_user: string, id_curso: string, req: Request): Promise<number>
}

export default IAlunosRepository;