import { ObjectId } from "mongodb";

type InscricoesSchema = {
    _id: ObjectId;
    id: number;
    id_aluno: number;
    id_curso: number;
    data_inscricao: Date;
}

export default InscricoesSchema;