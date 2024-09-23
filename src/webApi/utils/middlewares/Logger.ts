// import { Response, NextFunction } from "express";
// import CustomRequest from "../../controllers/CustomRequest";


// function logger(req: CustomRequest, res: Response, next: NextFunction): void {

//     const data = new Date();
//     console.log(`${data.toLocaleString()} ${req.method} ${req.url}`);
//     next();    
// }

// export default logger;

// SEGUINDO ORIENTACAO A OBJETOS:
import { Request, Response, NextFunction } from "express";

class Logger {

    static init(req: Request, res: Response, next: NextFunction) {
        const data = new Date();
        console.log(`${data.toLocaleString()} ${req.method} ${req.url}`);
        next();
    }
}

export default Logger;