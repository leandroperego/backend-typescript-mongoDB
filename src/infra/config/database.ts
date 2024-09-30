import 'dotenv/config';
import IDatabase from '../../dominio/interfaces/IDatabase';
import { injectable } from 'inversify';
import { MongoClient, ServerApiVersion } from 'mongodb';

@injectable()
class Database implements IDatabase {

    async conectar(): Promise<MongoClient> {

        if (!process.env.DATABASE_URL) {
            throw new Error('Database URL not found');
        }

        const client = new MongoClient(process.env.DATABASE_URL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });

        try {
            await client.connect();
            console.log('Conectado ao banco de dados!');
            return client;
        } catch (err: any) {
            console.log(err.message);
            throw err;
        }
    }
    async desconectar(client: MongoClient): Promise<void> {
        await client.close();
        console.log('Desconectado do banco de dados!');
    }

    // async getCollection(client: MongoClient, collection: string): Promise<Collection> {

    //     return await client.db(process.env.DATABASE_NAME).collection(collection);
    // }

}

export default Database;