import { ObjectId } from "mongodb";

type CursosSchema = {
    _id: ObjectId;
    id: number;
    nome: string;
    descricao: string;
    capa: string;
    inscricoes: number;
    inicio: Date;
}

export default CursosSchema;