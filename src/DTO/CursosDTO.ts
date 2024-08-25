import Cancelamentos from "../entidades/Cancelamentos";
import Cursos from "../entidades/Cursos";
import Inscricoes from "../entidades/Inscricoes";

export type ObterCursosDTO = Required<Cursos>;

export type ObterInscricoesCursosDTO = Required<Inscricoes>;

export type ObterCancelamentosCursosDTO = Required<Cancelamentos>;

export interface ObterCursosInscricoesCancelamentosDTO extends ObterCursosDTO {
    data_inscricao?: Date;
    data_cancelamento?: Date;
}