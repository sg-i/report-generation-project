import express, { Request, Response } from 'express';
import salesRouter from './routes/salesRoutes';
const app = express();

app.use(express.json());

app.use('/api', salesRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});