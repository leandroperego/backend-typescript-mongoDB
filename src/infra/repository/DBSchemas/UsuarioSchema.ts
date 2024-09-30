import { ObjectId } from "mongodb";

type UsuarioSchema = {
    _id: ObjectId;
    id: string;
    nome: string;
    email: string;
    // nascimento: Date;
}

export default UsuarioSchema;