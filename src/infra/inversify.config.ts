import { Container } from "inversify";
import IAlunosRepository from "../dominio/interfaces/IAlunosRepository";
import AlunosRepository from "../infra/repository/AlunosRepository";
import IAlunosServices from "../dominio/interfaces/IAlunosServices";
import AlunosServices from "../dominio/servicos/AlunosServices";
import IAlunosController from "../dominio/interfaces/IAlunosController";
import AlunosController from "../webApi/controllers/AlunosController";
import IDatabase from "../dominio/interfaces/IDatabase";
import database from "./config/database";
import IAuthentication from "../dominio/interfaces/IAuthentication";
import AuthenticationMiddleware from "../webApi/utils/middlewares/AuthenticationMiddleware";
import ICursosController from "../dominio/interfaces/ICursosController";
import CursosController from "../webApi/controllers/CursosController";
import ICursosServices from "../dominio/interfaces/ICursosServices";
import CursosServices from "../dominio/servicos/CursosServices";
import ICursosRepository from "../dominio/interfaces/ICursosRepository";
import CursosRepository from "./repository/CursosRepository";
import ISessaoController from "../dominio/interfaces/ISessaoController";
import SessaoController from "../webApi/controllers/SessaoController";
import ISessaoServices from "../dominio/interfaces/ISessaoServices";
import SessaoServices from "../dominio/servicos/SessaoServices";
import ISessaoRepository from "../dominio/interfaces/ISessaoRepository";
import SessaoRepository from "./repository/SessaoRepository";

let container = new Container();

container
    .bind<IDatabase>('IDatabase')
    .to(database)
    .inSingletonScope();
container
    .bind<IAuthentication>('IAuthentication')
    .to(AuthenticationMiddleware)
    .inRequestScope();
container
    .bind<ISessaoRepository>('ISessaoRepository')
    .to(SessaoRepository)
    .inRequestScope();
container
    .bind<IAlunosRepository>('IAlunosRepository')
    .to(AlunosRepository)
    .inRequestScope();
container
    .bind<ICursosRepository>('ICursosRepository')
    .to(CursosRepository)
    .inRequestScope();
container
    .bind<ISessaoServices>('ISessaoServices')
    .to(SessaoServices)
    .inRequestScope();
container
    .bind<IAlunosServices>('IAlunosServices')
    .to(AlunosServices)
    .inRequestScope();
container
    .bind<ICursosServices>('ICursosServices')
    .to(CursosServices)
    .inRequestScope();
container
    .bind<ISessaoController>('ISessaoController')
    .to(SessaoController)
    .inRequestScope();
container
    .bind<IAlunosController>('IAlunosController')
    .to(AlunosController)
    .inRequestScope();
container
    .bind<ICursosController>('ICursosController')
    .to(CursosController)
    .inRequestScope();


export default container;