import { ObjectId } from "mongodb";

type InscricoesSchema = {
    _id: ObjectId;
    id: string;
    id_aluno: string;
    id_curso: string;
    data_inscricao: Date;
}

export default InscricoesSchema;