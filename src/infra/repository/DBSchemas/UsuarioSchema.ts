import { ObjectId } from "mongodb";

type UsuarioSchema = {
    _id: ObjectId;
    id: number;
    nome: string;
    email: string;
    // nascimento: Date;
}

export default UsuarioSchema;