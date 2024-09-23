import { Request } from 'express';
import { ObterCursosDTO, ObterCursosInscricoesCancelamentosDTO } from '../DTO/CursosDTO';

interface IAlunosRepository {
    findAll(iniciados: boolean): Promise<ObterCursosDTO[]>
    findAllWithoutRegistration(id_user: number): Promise<ObterCursosDTO[]>
    findAllRegistration(id_user: number): Promise<ObterCursosInscricoesCancelamentosDTO[]>
    findCursoById(id_curso: number): Promise<boolean>
    handleMatriculas(id_user: number, id_curso: number, req: Request): Promise<number>
}

export default IAlunosRepository;