import { ObterCancelamentosCursosDTO, ObterCursosDTO, ObterCursosInscricoesCancelamentosDTO, ObterInscricoesCursosDTO } from "../DTO/CursosDTO";
import { Request } from 'express';
import ICursosRepository from "../../dominio/interfaces/ICursosRepository";
import IDatabase from "../../dominio/interfaces/IDatabase";
import { inject, injectable } from "inversify";

@injectable()
class CursosRepository implements ICursosRepository {

  private TABLE = "cursos";

  constructor(
    @inject('IDatabase') private database: IDatabase
  ) { }

   findAll = async(iniciados = true): Promise<ObterCursosDTO[]> => {

    const cliente = await this.database.conectar();

    let result: ObterCursosDTO[] = [];
    if (!iniciados) {
      result = await this.database.query(cliente,
        `SELECT * FROM ${this.TABLE}
                WHERE inicio > CURRENT_DATE`) || [];
    } else {
      result = await this.database.query(cliente, `SELECT * FROM ${this.TABLE}`) || [];
    }
    await this.database.desconectar(cliente);
    return result;
  }

   findAllWithoutRegistration = async(id_user: number): Promise<ObterCursosDTO[]> => {

    const cliente = await this.database.conectar();

    const result: ObterCursosDTO[] = await this.database.query(cliente,
      `SELECT * FROM (SELECT * FROM ${this.TABLE} WHERE inicio > CURRENT_DATE)
                  WHERE id NOT IN 
                        ( SELECT id_curso FROM inscricoes WHERE id_aluno = $1)`, [id_user]);

    await this.database.desconectar(cliente);
    return result;

  }

   findAllRegistration = async(id_user: number): Promise<ObterCursosInscricoesCancelamentosDTO[]> => {
    const cliente = await this.database.conectar();

    const result: ObterCursosInscricoesCancelamentosDTO[] = await this.database.query(cliente, `
      WITH user_courses AS (
          SELECT id_curso, MIN(data_inscricao) AS data_inscricao, NULL AS data_cancelamento
          FROM inscricoes
          WHERE id_aluno = $1
          GROUP BY id_curso
  
          UNION
  
          SELECT id_curso, NULL AS data_inscricao, MIN(data_cancelamento) AS data_cancelamento
          FROM cancelamentos
          WHERE id_aluno = $1
          GROUP BY id_curso
      )
      SELECT 
          c.id, 
          c.nome,
          c.descricao,
          c.capa,
          c.inscricoes,
          c.inicio,
          MAX(uc.data_inscricao) AS data_inscricao,
          MAX(uc.data_cancelamento) AS data_cancelamento
      FROM cursos c
      JOIN user_courses uc ON c.id = uc.id_curso
      GROUP BY c.id, c.nome;`, [id_user]);

    await this.database.desconectar(cliente);

    return result;
  }

   findCursoById = async(id_curso: number): Promise<boolean> => {
    const cliente = await this.database.conectar();

    const result: ObterCursosDTO[] = await this.database.query(cliente,
      `SELECT * FROM ${this.TABLE} 
                  WHERE id = $1`, [id_curso]);

    await this.database.desconectar(cliente);

    return result && result.length > 0;
  }

   handleMatriculas = async(id_user: number, id_curso: number, req: Request): Promise<number> => {

    const cliente = await this.database.conectar();

    let result = null;

    if (await this.usuarioMatriculado(id_user, id_curso) && await this.usuarioJaCancelou(id_user, id_curso) === false && req.method === 'DELETE') {
      await this.database.query(cliente,
        `INSERT INTO cancelamentos (id_aluno, id_curso) 
                  VALUES ($1, $2)`, [id_user, id_curso]);
      result = 0;
    } else {
      if (await this.usuarioJaCancelou(id_user, id_curso) === false && req.method === 'POST') {
        await this.database.query(cliente,
          `INSERT INTO inscricoes (id_aluno, id_curso) 
                    VALUES ($1, $2)`, [id_user, id_curso]);
        result = 1;
      } else {
        result = 2;
      }
    }

    await this.database.desconectar(cliente);
    return result;
  }

  private  usuarioMatriculado = async(id_user: number, id_curso: number): Promise<boolean> => {
    const cliente = await this.database.conectar();

    const result: ObterInscricoesCursosDTO[] = await this.database.query(cliente,
      `SELECT * FROM inscricoes 
              WHERE id_aluno = $1 AND id_curso = $2`, [id_user, id_curso]);

    await this.database.desconectar(cliente);

    return result && result.length > 0;
  }

  private  usuarioJaCancelou = async(id_user: number, id_curso: number): Promise<boolean> => {
    const cliente = await this.database.conectar();

    const result: ObterCancelamentosCursosDTO[] = await this.database.query(cliente,
      `SELECT * FROM cancelamentos 
              WHERE id_aluno = $1 AND id_curso = $2`, [id_user, id_curso]);

    await this.database.desconectar(cliente);

    return result && result.length > 0;
  }


}

export default CursosRepository;