import AutenticacaoSchema from "./AutenticacaoSchema";
import CancelamentosSchema from "./CancelamentosSchema";
import CursosSchema from "./CursosSchema";
import InscricoesSchema from "./InscricoesSchema";
import UsuarioSchema from "./UsuarioSchema";

interface DBSchema {
    usuario: UsuarioSchema[];
    cursos: CursosSchema[];
    inscricoes: InscricoesSchema[];
    autenticacao: AutenticacaoSchema[];
    cancelamentos: CancelamentosSchema[];
}

export default DBSchema;