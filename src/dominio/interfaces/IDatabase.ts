import { MongoClient } from "mongodb";

interface IDatabase {
    conectar(): Promise<MongoClient>;
    desconectar(client: MongoClient): Promise<void>;
}

export default IDatabase;