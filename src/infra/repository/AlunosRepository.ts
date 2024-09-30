import { AtualizarAlunoDTO, CriarAlunoDTO, ObterDadosUsuarioDTO } from "../DTO/UsuarioDTO";
import bcrypt from 'bcrypt';
import Usuario from "../../entidades/Usuario";
import IDatabase from "../../dominio/interfaces/IDatabase";
import IAlunosRepository from "../../dominio/interfaces/IAlunosRepository";
import { inject, injectable } from "inversify";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import AutenticaoSchema from "./DBSchemas/AutenticacaoSchema";

@injectable()
class AlunosRepository implements IAlunosRepository {

  private COLLECTION_NAME = "usuario";

  constructor(
    @inject('IDatabase') private databaseConnection: IDatabase
  ) { }

  // DEVERIA INSERIR O getDBProps na interface?
  private async getDBProps(): Promise<{ dbAcess: Db, collection: Collection<Usuario>, client: MongoClient }> {

    const client = await this.databaseConnection.conectar();
    const dbAcess = client.db(process.env.DB_NAME);
    const collection = dbAcess.collection<Usuario>(this.COLLECTION_NAME);
    return { dbAcess, collection, client };
  }

  findByEmail = async (email: string): Promise<ObterDadosUsuarioDTO | null> => {

    const { client, collection } = await this.getDBProps();

    try {
      const result = await collection.findOne({ email: email }, { projection: { _id: 0, senha: 0 } });
      return result as ObterDadosUsuarioDTO | null;

    } catch (error: any) {
      console.log(error);
      throw new Error(error);

    } finally {
      await this.databaseConnection.desconectar(client);
    }

  }

  findById = async (id: string): Promise<ObterDadosUsuarioDTO | null> => {

    const { client, collection } = await this.getDBProps();

    try {
      const result = await collection.findOne({ id: id }, { projection: { _id: 0, senha: 0 } });
      
      return result as ObterDadosUsuarioDTO | null;

    } catch (error: any) {
      console.log(error);
      throw new Error(error);

    } finally {
      await this.databaseConnection.desconectar(client);
    }

  }

  create = async (aluno: CriarAlunoDTO): Promise<CriarAlunoDTO | null> => {
    const senhaHash = bcrypt.hashSync(aluno.senha, 10);

    const { dbAcess, client, collection } = await this.getDBProps();

    const collectionAutenticacao = dbAcess.collection<AutenticaoSchema>('autenticacao');
    const session = client.startSession();

    try {
      session.startTransaction();

      const result = await collection.insertOne(
        { 
          id: new ObjectId().toString(),
          nome: aluno.nome, 
          email: aluno.email,
          senha: senhaHash
        });

      if (!result) return null;

      // ATÉ REALIZAR A ELIMINACAO DO ID E UTILIZAR APENAS O _ID DO MONGO, A CONSULTA ABAIXO SE FAZ NECESSARIA:
      const userCreated = await collection.findOne({ _id: result.insertedId });

      await collectionAutenticacao.insertOne(
        { 
          _id: result.insertedId,
          id_usuario: userCreated!.id,
          id: new ObjectId().toString(),
          email: aluno.email, 
          senha: senhaHash
        });

      session.commitTransaction();

      return aluno;

    } catch (error: any) {
      session.abortTransaction();
      console.log(error.message);
      return null;
    } finally {
      await this.databaseConnection.desconectar(client);
    }

  }

  update = async (id: string, aluno: AtualizarAlunoDTO): Promise<Usuario | null> => {

    const { dbAcess, client, collection } = await this.getDBProps();
    const collectionAutenticacao = dbAcess.collection<AutenticaoSchema>('autenticacao');
    const session = client.startSession();

    try {

      session.startTransaction();

      const resultUpdate = await collection.findOneAndUpdate({ id: id }, { $set: { ...aluno } });

      if (!resultUpdate) return null;

      const resultAfterUpdate = await collection.findOne({ id: id }, { projection: { senha: 0 } });

      await collectionAutenticacao.findOneAndUpdate({ id_usuario: id },
        {
          $set: {
            email: aluno.email
          }
        }
      )

      session.commitTransaction();

      return resultAfterUpdate as Usuario | null;

    } catch (error: any) {
      session.abortTransaction();
      console.log(error.message);
      return null;
    } finally {
      await this.databaseConnection.desconectar(client);
    }
  }

}

export default AlunosRepository;