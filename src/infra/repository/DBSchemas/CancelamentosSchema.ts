import { ObjectId } from "mongodb";

type CancelamentosSchema = {
    _id: ObjectId;
    id: number;
    id_aluno: number;
    id_curso: number;
    data_cancelamento: Date;
}

export default CancelamentosSchema;