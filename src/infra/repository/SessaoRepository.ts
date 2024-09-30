import { ObterDadosLoginDTO } from "../DTO/SessaoDTO";
import IDatabase from "../../dominio/interfaces/IDatabase";
import ISessaoRepository from "../../dominio/interfaces/ISessaoRepository";
import { inject, injectable } from "inversify";
import { Collection, Db, MongoClient } from "mongodb";
import AutenticaoSchema from "./DBSchemas/AutenticacaoSchema";

@injectable()
class SessaoRepository implements ISessaoRepository {

    private COLLECTION_NAME = "autenticacao";

    constructor(
        @inject('IDatabase') private database: IDatabase
    ) { }

    private async getDBProps(): Promise<{ dbAcess: Db, collection: Collection<AutenticaoSchema>, client: MongoClient }> {
        const client = await this.database.conectar();
        const dbAcess = client.db(process.env.DB_NAME);
        const collection = dbAcess.collection<AutenticaoSchema>(this.COLLECTION_NAME);
        return { dbAcess, collection, client };
    }

     findByUserId = async(id: string): Promise<ObterDadosLoginDTO | null> => {
        const { client, collection } = await this.getDBProps();

        try {
            const result = await collection.findOne({ id_usuario: id }, { projection: { _id: 0, email: 1, senha: 1 } });

            return result as ObterDadosLoginDTO | null;

        } catch (error) {
            console.log('erro ao buscar dados de sessao do id informado.');
            return null;
        } finally {
            this.database.desconectar(client);
        }

    }
}

export default SessaoRepository;