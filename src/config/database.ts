import pg from 'pg';
import 'dotenv/config';

export async function conectar(): Promise<pg.Client> {

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL
    });

    try{
        await client.connect();
        console.log('Conectado ao banco de dados!');
        return client;
    } catch (err: any) {
        console.log(err.message);
        throw err;
    }
}

export async function desconectar(client: pg.Client): Promise<void> {
    await client.end();
    console.log('Desconectado do banco de dados!');
}

export async function query(client: pg.Client, query: string, values: any = undefined): Promise<any[]> {

    try {
        const result = await client.query(query, values);
        return result.rows;
    } catch (err: any) {
        console.log("Erro ao executar a query: ", err);
        throw err;
    }
        
}