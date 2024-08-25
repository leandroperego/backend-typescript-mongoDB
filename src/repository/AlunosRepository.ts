import { conectar, desconectar, query } from "../config/database";
import { CriarAlunoDTO, ObterDadosUsuarioDTO } from "../DTO/UsuarioDTO";
import bcrypt from 'bcrypt';

const TABLE = "usuario";

class AlunosRepository {

    async findByEmail(email: string) : Promise<ObterDadosUsuarioDTO> {
        
        const cliente = await conectar();

        const result = await query(cliente, `SELECT * FROM ${TABLE} WHERE email = $1`, [email]);

        await desconectar(cliente);

        return result && result[0];
    }

    async create(aluno: CriarAlunoDTO) : Promise<CriarAlunoDTO | null> {
        const senhaHash = bcrypt.hashSync(aluno.senha, 10);

        const cliente = await conectar();

        try {
            await query(cliente, 'BEGIN');
      
            const result = await query(cliente, `INSERT INTO ${TABLE}(nome, email) VALUES ($1, $2) RETURNING *`, [aluno.nome, aluno.email]);
      
            if (!result) return null;

            await query(cliente, `INSERT INTO autenticacao(id_usuario, email, senha) VALUES ($1, $2, $3)`, [result[0].id, result[0].email, senhaHash]);
      
            await query(cliente, 'COMMIT');

            return aluno;
      
          } catch (error: any) {
            await query(cliente, 'ROLLBACK');
            console.log(error.message);
            return null;
          } finally {
            await desconectar(cliente);
          }
      
        }

}

export default new AlunosRepository();