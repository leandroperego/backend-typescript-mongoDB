import { Collection, MongoClient } from "mongodb";

interface IDatabase {
    conectar(): Promise<MongoClient>;
    desconectar(client: MongoClient): Promise<void>;
    getCollection(client: MongoClient, collection: string): Promise<Collection>;
}

export default IDatabase;