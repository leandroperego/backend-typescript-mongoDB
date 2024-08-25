import { conectar, desconectar, query } from "../config/database";
import { ObterDadosLoginDTO } from "../DTO/SessaoDTO";


const TABLE = "autenticacao";

class SessaoRepository {
    async findById(id: string): Promise<ObterDadosLoginDTO | null> {
        const cliente = await conectar();

        try{
            const sql = `SELECT * FROM ${TABLE} WHERE id_usuario = $1`;
            const valores = [id];
    
            const result = await query(cliente, sql, valores);
            return result && result[0];

        } catch (error){
            console.log('erro ao buscar dados de sessao do id informado.');
            return null;
        } finally{
            desconectar(cliente);
        }
        
    }
}

export default new SessaoRepository();