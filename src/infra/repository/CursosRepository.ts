import { ObterCursosInscricoesCancelamentosDTO } from "../DTO/CursosDTO";
import { Request } from 'express';
import ICursosRepository from "../../dominio/interfaces/ICursosRepository";
import IDatabase from "../../dominio/interfaces/IDatabase";
import { inject, injectable } from "inversify";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import CursosSchema from "./DBSchemas/CursosSchema";
import InscricoesSchema from "./DBSchemas/InscricoesSchema";
import CancelamentosSchema from "./DBSchemas/CancelamentosSchema";

@injectable()
class CursosRepository implements ICursosRepository {

  COLLECTION_NAME = "cursos";

  constructor(
    @inject('IDatabase') private databaseConnection: IDatabase,
  ) { }

  private async getDatabaseProps(): Promise<{ dbAcess: Db ,collection: Collection<CursosSchema>, client: MongoClient }> {

    const client = await this.databaseConnection.conectar();
    const dbAcess = client.db(process.env.DATABASE_NAME);
    const collection = dbAcess.collection<CursosSchema>(this.COLLECTION_NAME);

    return { dbAcess, collection, client };
  }

  findAll = async (iniciados = true): Promise<CursosSchema[]> => {

    /* Da pra fazer de 2 formas:
      Mapeando os valores obtidos do tipo WithId<Document> para ObterCursosDTO
      OU
      tipar o getCollection<AQUI O TIPO> com o tipo que a colecao é no banco de dados, para garantir que o resultado seja do tipo Informado
    */

    const { collection, client } = await this.getDatabaseProps();
    try {

      let result;
      if (!iniciados) {
        result = await collection.find({
          inicio: {
            $gte: new Date()
          }
        }).toArray();
      } else {
        result = await collection.find({}).toArray();
      }

      return result;

    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      await this.databaseConnection.desconectar(client);
    }
  }

  findAllWithoutRegistration = async (id_user: number): Promise<CursosSchema[]> => {

    const { dbAcess ,collection, client } = await this.getDatabaseProps();

    try {

      const result = await collection.find({
        inicio: {
          $gte: new Date()
        },
        id: {
          $nin: await dbAcess.collection<InscricoesSchema>("inscricoes")
            .find({ id_aluno: id_user })
            .map((inscricao => inscricao.id_curso))
            .toArray()
        }
      }).toArray();

      return result;

    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      await this.databaseConnection.desconectar(client);
    }
  }

  findAllRegistration = async (id_user: number): Promise<ObterCursosInscricoesCancelamentosDTO[]> => {
    const { collection, client } = await this.getDatabaseProps();

    try {

      const result = await collection.aggregate([
        {
          $lookup: {
            from: 'inscricoes',
            let: { cursoId: "$id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$id_curso", "$$cursoId"] }, { $eq: ["$id_aluno", id_user] }] } } },
              { $group: { id: "$id_curso", data_inscricao: { $min: "$data_inscricao" } } }
            ],
            as: 'inscricao'
          }
        },
        { $unwind: { path: "$inscricao", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'cancelamentos',
            let: { cursoId: "$id" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ["$id_curso", "$$cursoId"] }, { $eq: ["$id_aluno", id_user] }] } } },
              { $group: { id: "$id_curso", data_cancelamento: { $min: "$data_cancelamento" } } }
            ],
            as: 'cancelamento'
          }
        },
        { $unwind: { path: "$cancelamento", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            id: 1,
            nome: 1,
            descricao: 1,
            capa: 1,
            inscricoes: 1,
            inicio: 1,
            data_inscricao: "$inscricao.data_inscricao",
            data_cancelamento: "$cancelamento.data_cancelamento"
          }
        },
        {
          $match: {
            $or: [
              { "data_inscricao": { $ne: null } },
              { "data_cancelamento": { $ne: null } }
            ]
          }
        }
      ]).toArray();

      return result as ObterCursosInscricoesCancelamentosDTO[];

    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      await this.databaseConnection.desconectar(client);
    }
  }

  cursoByIdExists = async (id_curso: number): Promise<boolean> => {
    const { collection, client } = await this.getDatabaseProps();

    try {
      const result = await collection.findOne({ id: id_curso });

      return result !== null;

    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      await this.databaseConnection.desconectar(client);
    }
  }

  handleMatriculas = async (id_user: number, id_curso: number, req: Request): Promise<number> => {

    const { dbAcess, client } = await this.getDatabaseProps();

    let result = null;

    try {
      if (await this.usuarioMatriculado(id_user, id_curso) && await this.usuarioJaCancelou(id_user, id_curso) === false && req.method === 'DELETE') {
        await client.db(process.env.DATABASE_NAME).collection<CancelamentosSchema>("cancelamentos")
          .insertOne({
            id_aluno: id_user, id_curso: id_curso, data_cancelamento: new Date(),
            _id: new ObjectId(),
            id: Number(new ObjectId()) // TODO: MODIFICAR O USO DE ID NUMBER. USAR SOMENTE _ID DO MONGO
          });
        result = 0;
      } else {
        if (await this.usuarioJaCancelou(id_user, id_curso) === false && req.method === 'POST') {
          await dbAcess.collection<InscricoesSchema>("inscricoes")
            .insertOne({
              id_aluno: id_user, id_curso: id_curso, data_inscricao: new Date(),
              _id: new ObjectId(),
              id: Number(new ObjectId()) // TODO: MODIFICAR O USO DE ID NUMBER. USAR SOMENTE _ID DO MONGO
            });
          result = 1;
        } else {
          result = 2;
        }
      }

      return result;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    } finally {
      await this.databaseConnection.desconectar(client);
    }
  }

  private usuarioMatriculado = async (id_user: number, id_curso: number): Promise<boolean> => {
    const { dbAcess, client } = await this.getDatabaseProps();

    try {
      const result = await dbAcess.collection<InscricoesSchema>("inscricoes")
        .findOne({ id_aluno: id_user, id_curso: id_curso });

      return result !== null;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      await this.databaseConnection.desconectar(client);
    }
  }

  private usuarioJaCancelou = async (id_user: number, id_curso: number): Promise<boolean> => {
    const { dbAcess, client } = await this.getDatabaseProps();

    try {

      const result = await dbAcess.collection<CancelamentosSchema>("cancelamentos")
        .findOne({ id_aluno: id_user, id_curso: id_curso });

      return result !== null;

    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    } finally {
      await this.databaseConnection.desconectar(client);
    }
  }

}

export default CursosRepository;