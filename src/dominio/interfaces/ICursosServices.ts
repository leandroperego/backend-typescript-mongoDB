import { ObterCursosDTO } from "../../infra/DTO/CursosDTO";
import { ObterIdUsuarioDTO } from "../../infra/DTO/UsuarioDTO";
import CustomRequest from "./CustomRequest";

interface ICursosServices {
    findAll(user: ObterIdUsuarioDTO | undefined): Promise<ObterCursosDTO[]>;
    handleMatriculas(userId: string, cursoId: string, req: CustomRequest): Promise<number>
}

export default ICursosServices;