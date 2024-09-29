import { ObjectId } from "mongodb";

type AutenticaoSchema = {
    _id: ObjectId;
    id: number;
    id_usuario: number;
    email: string;
    senha: string;
}

export default AutenticaoSchema;