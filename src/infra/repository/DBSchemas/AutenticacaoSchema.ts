import { ObjectId } from "mongodb";

type AutenticaoSchema = {
    _id: ObjectId;
    id: string;
    id_usuario: string;
    email: string;
    senha: string;
}

export default AutenticaoSchema;