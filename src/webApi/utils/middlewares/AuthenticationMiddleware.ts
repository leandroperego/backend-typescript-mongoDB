import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import CustomRequest from "../../controllers/CustomRequest";
import { ObterIdUsuarioDTO } from "../../../infra/DTO/UsuarioDTO";
import IAuthentication from "../../../dominio/interfaces/IAuthentication";

// function isAuth(req: CustomRequest, res: Response, next: NextFunction): void {
//     const token: string = req.cookies['x-auth'];

//     if (!token) {
//         res.status(403).json({
//             type: 'error',
//             message: 'Nenhum usuário logado'
//         });
//         return;
//     }

//     const secret = process.env.SECRET;

//     if (secret) {
//         try {
//             jwt.verify(token, secret, (err, decoded) => {
//                 if (err) {
//                     res.status(401).json({
//                         type: 'error',
//                         message: 'Token inválido'
//                     })
//                 } else {
//                     req.user = decoded as ObterIdUsuarioDTO;
//                     next();
//                 }
//             });

//         } catch (error) {
//             res.status(500).json({
//                 type: 'error',
//                 message: 'Erro ao verificar o token'
//             });
//         }
//     }
// }

// export default isAuth;


// SEGUINDO ORIENTACAO A OBJETOS:

class AuthenticationMiddleware implements IAuthentication {

    isAuth(req: CustomRequest, res: Response, next: NextFunction): void {
        const token: string = req.cookies['x-auth'];

        if (!token) {
            res.status(403).json({
                type: 'error',
                message: 'Nenhum usuário logado'
            });
            return;
        }

        const secret = process.env.SECRET;

        if (secret) {
            try {
                jwt.verify(token, secret, (err, decoded) => {
                    if (err) {
                        res.status(401).json({
                            type: 'error',
                            message: 'Token inválido'
                        })
                    } else {
                        req.user = decoded as ObterIdUsuarioDTO;
                        next();
                    }
                });

            } catch (error) {
                res.status(500).json({
                    type: 'error',
                    message: 'Erro ao verificar o token'
                });
            }
        }
    }

}

export default AuthenticationMiddleware;