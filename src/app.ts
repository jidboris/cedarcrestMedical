import express, {Express, Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import database from './Config/database';
import RouterA  from "./Routes";
import { AppError } from './Utilities/Errors/appError';
import errorHandler from './Utilities/Errors/errorHandler';

 dotenv.config();

 const app: Express = express();
 const port: number = Number(process.env.PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Route
app.use("/cmf", RouterA);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
   next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});
app.use(errorHandler);

 app.get('/', (req: Request,res:Response) => {
res.send('<h1> Welcome to Cedar-crest Medical Center! </h1>')
 });

database()
.catch((err) => console.error(err));
 app.listen(port, ()=> {
    console.log(`server is listening on port ${port}`)
 })

 export default app;