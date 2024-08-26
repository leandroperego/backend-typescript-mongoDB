import { Request, Response } from 'express';
import { ObterDadosUsuarioDTO } from '../DTO/UsuarioDTO';
import AlunosRepository from '../repository/AlunosRepository';
import SessaoRepository from '../repository/SessaoRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CriarSessaoDTO } from '../DTO/SessaoDTO';
import { validationResult } from 'express-validator';

class SessaoController {

    async create(req: Request, res: Response): Promise<void> {

        const errosValidacao = validationResult(req);

        if (!errosValidacao.isEmpty()) {
            res.status(400).json({
                type: 'error',
                errors: errosValidacao.array()
            });
            return;
        }

        try{
            const { email, senha }: CriarSessaoDTO = req.body;

            const usuario: ObterDadosUsuarioDTO = await AlunosRepository.findByEmail(email).then((aluno) => aluno);

            if (!usuario) {
                res.status(400).json({
                    type: 'error',
                    message: 'E-mail e/ou senha inválidos'
                });
                return;
            }

            const dadosLogin = await SessaoRepository.findById(usuario.id);

            if (!dadosLogin) {
                throw new Error("Dados de login não encontrados");
            }

            const senhaValida = await bcrypt.compareSync(senha, dadosLogin.senha);

            if (!senhaValida) {
                res.status(400).json({
                    type: 'error',
                    message: 'E-mail e/ou senha inválidos'
                });
                return;
            }

            const secret = process.env.SECRET;

            if (secret) {
                const token = jwt.sign({ id: usuario.id }, secret, {
                    expiresIn: '1d'
                });
    
                res.cookie('x-auth', token);
                res.status(200).json({
                    type: 'sucess',
                    message: 'Login realizado com sucesso'
                });
    
            }
            
            return;

        } catch (error) {
            console.log(error);
            res.status(500).json({
                type: 'error',
                message: 'Erro ao realizar login'
            });
            return;
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        res.clearCookie('x-auth');
        res.status(200).json({ message: 'Logout success' });
        return;
    }
}

export default new SessaoController();