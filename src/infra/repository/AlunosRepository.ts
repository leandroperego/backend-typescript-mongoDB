import { AtualizarAlunoDTO, CriarAlunoDTO, ObterDadosUsuarioDTO } from "../DTO/UsuarioDTO";
import bcrypt from 'bcrypt';
import Usuario from "../../entidades/Usuario";
import IDatabase from "../../dominio/interfaces/IDatabase";
import IAlunosRepository from "../../dominio/interfaces/IAlunosRepository";

class AlunosRepository implements IAlunosRepository {

  private TABLE = "usuario";

  constructor(
    private database: IDatabase
  ) { }

  async findByEmail(email: string): Promise<ObterDadosUsuarioDTO> {

    const cliente = await this.database.conectar();

    const result = await this.database.query(cliente, `SELECT * FROM ${this.TABLE} WHERE email = $1`, [email]);

    await this.database.desconectar(cliente);

    return result && result[0];
  }

  async findById(id: number): Promise<ObterDadosUsuarioDTO> {

    const cliente = await this.database.conectar();

    const result = await this.database.query(cliente, `SELECT * FROM ${this.TABLE} WHERE id = $1`, [id]);

    await this.database.desconectar(cliente);

    return result && result[0];
  }

  async create(aluno: CriarAlunoDTO): Promise<CriarAlunoDTO | null> {
    const senhaHash = bcrypt.hashSync(aluno.senha, 10);

    const cliente = await this.database.conectar();

    try {
      await this.database.query(cliente, 'BEGIN');

      const result = await this.database.query(cliente, `INSERT INTO ${this.TABLE}(nome, email) VALUES ($1, $2) RETURNING *`, [aluno.nome, aluno.email]);

      if (!result) return null;

      await this.database.query(cliente, `INSERT INTO autenticacao(id_usuario, email, senha) VALUES ($1, $2, $3)`, [result[0].id, result[0].email, senhaHash]);

      await this.database.query(cliente, 'COMMIT');

      return aluno;

    } catch (error: any) {
      await this.database.query(cliente, 'ROLLBACK');
      console.log(error.message);
      return null;
    } finally {
      await this.database.desconectar(cliente);
    }

  }

  async update(id: number, aluno: AtualizarAlunoDTO): Promise<Usuario | null> {

    const cliente = await this.database.conectar();

    try {

      await this.database.query(cliente, 'BEGIN');

      const result = await this.database.query(cliente, `UPDATE ${this.TABLE} SET nome = $1, email = $2 WHERE id = $3 RETURNING *`, [aluno.nome, aluno.email, id]);

      if (!result) return null;

      await this.database.query(cliente, `UPDATE autenticacao SET email = $1 WHERE id_usuario = $2 RETURNING *`, [aluno.email, id]);

      await this.database.query(cliente, 'COMMIT');

      return result[0];

    } catch (error: any) {
      await this.database.query(cliente, 'ROLLBACK');
      console.log(error.message);
      return null;
    } finally {
      await this.database.desconectar(cliente);
    }
  }

}

export default AlunosRepository;