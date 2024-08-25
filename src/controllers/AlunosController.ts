import { Request, Response } from 'express';
import { CriarAlunoDTO, ObterDadosUsuarioDTO } from '../DTO/UsuarioDTO';
import AlunosRepository from '../repository/AlunosRepository';

class AlunosController {

    async store(req: Request, res: Response): Promise<void> {
        const { nome, email, senha }: CriarAlunoDTO = req.body;

        if (!nome || !email || !senha) {
            res.status(400).json({
                type: 'error',
                message: 'Preencha todos os campos obrigatórios.'
            });
            return;
        }

        if (await emailExist(email)) {
            res.status(400).json({
                type: 'error',
                message: 'Não é possivel cadastrar esse e-mail. Email já está em uso.'
            });
            return;
        }

        const result = await AlunosRepository.create({ nome, email, senha });

        if (!result) {
            res.status(400).json({
                type: 'error',
                message: 'Erro ao criar aluno.'
            });
            return;
        } else {
            res.status(201).json({
                type: 'success',
                message: 'Aluno criado com sucesso.',
                data: result
            });
            return;
        }

    }

}

async function emailExist(email: string) {
    const result: ObterDadosUsuarioDTO = await AlunosRepository.findByEmail(email);
    return result;
}


export default new AlunosController();