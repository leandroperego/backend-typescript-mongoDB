import { ObjectId } from "mongodb";

type CancelamentosSchema = {
    _id: ObjectId;
    id: string;
    id_aluno: string;
    id_curso: string;
    data_cancelamento: Date;
}

export default CancelamentosSchema;