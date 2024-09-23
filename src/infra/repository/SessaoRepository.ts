import { ObterDadosLoginDTO } from "../DTO/SessaoDTO";
import IDatabase from "../../dominio/interfaces/IDatabase";
import ISessaoRepository from "../../dominio/interfaces/ISessaoRepository";

class SessaoRepository implements ISessaoRepository {

    private TABLE = "autenticacao";

    constructor(
        private database: IDatabase
    ) { }

    async findById(id: number): Promise<ObterDadosLoginDTO | null> {
        const cliente = await this.database.conectar();

        try {
            const sql = `SELECT * FROM ${this.TABLE} WHERE id_usuario = $1`;
            const valores = [id];

            const result = await this.database.query(cliente, sql, valores);
            return result && result[0];

        } catch (error) {
            console.log('erro ao buscar dados de sessao do id informado.');
            return null;
        } finally {
            this.database.desconectar(cliente);
        }

    }
}

export default SessaoRepository;