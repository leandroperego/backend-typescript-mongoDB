

interface IDatabase<Client= any, Result = any> {
    conectar(): Promise<Client>;
    desconectar(client: Client): Promise<void>;
    query(client: Client,query: string, values?: any[]): Promise<Result>;
}

export default IDatabase;