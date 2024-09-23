import pg from 'pg';
import 'dotenv/config';
import IDatabase from '../interfaces/IDatabase';

class Database implements IDatabase {

    async conectar(): Promise<pg.Client> {
        const client = new pg.Client({
            connectionString: process.env.DATABASE_URL
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
    async desconectar(client: pg.Client): Promise<void> {
        await client.end();
        console.log('Desconectado do banco de dados!');
    }
    async query(client: pg.Client, query: string, values?: any[]): Promise<any[]> {
        try {
            const result = await client.query(query, values);
            return result.rows;
        } catch (err: any) {
            console.log("Erro ao executar a query: ", err);
            throw err;
        }
    }

}

export default new Database();