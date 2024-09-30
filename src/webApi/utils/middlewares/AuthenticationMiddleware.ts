import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import CustomRequest from "../../../dominio/interfaces/CustomRequest";
import { ObterIdUsuarioDTO } from "../../../infra/DTO/UsuarioDTO";
import IAuthentication from "../../../dominio/interfaces/IAuthentication";
import { injectable } from "inversify";

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

@injectable()
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

    verifyIsAuth(req: CustomRequest, res: Response, next: NextFunction): void {
        const token: string = req.cookies['x-auth'];
        const secret = process.env.SECRET;

        if (token) {
            try {
              const decoded = jwt.verify(token, secret!);

              req.user = decoded as ObterIdUsuarioDTO;
            } catch (error) {
              // Se o token for inválido, req.user fica undefined
            }
          }

        next();
    }

}

export default AuthenticationMiddleware;