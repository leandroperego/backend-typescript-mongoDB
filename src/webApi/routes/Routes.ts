import { Request, Response, Express } from 'express';
import SessaoRouter from './SessaoRouter';
import AlunosRouter from './AlunosRouter';
import CursosRouter from './CursosRouter';
import { ObterIdUsuarioDTO } from '../../infra/DTO/UsuarioDTO';
import CustomRequest from '../../dominio/interfaces/CustomRequest';
import { validationResult } from 'express-validator';
import container from '../../infra/inversify.config';
import ICursosRepository from '../../dominio/interfaces/ICursosRepository';
import IAuthentication from '../../dominio/interfaces/IAuthentication';
import IRouters from '../../dominio/interfaces/IRouters';

const cursosRepository = container.get<ICursosRepository>('ICursosRepository');
const auth = container.get<IAuthentication>('IAuthentication');
const cursosRouters = container.get<IRouters>('CursosRouters');
const alunosRouters = container.get<IRouters>('AlunosRouters');
const sessaoRouters = container.get<IRouters>('SessaoRouters');

class Routes {
    public static init(app: Express) {
        app.use('/', sessaoRouters.routes());
        app.use('/usuarios', alunosRouters.routes());
        app.use('/cursos', cursosRouters.routes());
        app.get('/:id', auth.isAuth, async (req: CustomRequest, res: Response) => {

            const errosValidacao = validationResult(req);

            if (!errosValidacao.isEmpty()) {
                res.status(400).json({
                    type: 'error',
                    errors: errosValidacao.array()
                });
                return;
            }

            const { id: id_user }: ObterIdUsuarioDTO = req.user as ObterIdUsuarioDTO;
            const { id: id_rota } = req.params;

            if (id_user !== Number(id_rota)) {
                res.status(403).json({
                    type: 'error',
                    mensagem: 'Não autorizado'
                });
                return;
            }
            const cursos = await cursosRepository.findAllRegistration(id_user);

            res.status(200).json(cursos);
        });
        app.get('/:any', (req: Request, res: Response) => res.status(404).send('404 - Not Found'));
    }
}

export default Routes;