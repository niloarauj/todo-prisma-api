import express from 'express';
import routes from './routes/auth.routes';
import taskRoutes from './routes/task.routes'; 
const app = express();
app.use(express.json());

app.use('/auth', routes);
app.use('/tasks', taskRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});