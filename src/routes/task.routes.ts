import express from 'express'
import { createTask, updateTask } from '../controllers/task.controllers'


const router = express.Router()

// create task route (POST)
router.post('/createTasks', createTask); // Forma simplificada

// update task route (PUT)
router.put('/updateTasks/:id', updateTask); // Note o :id para identificar a tarefa

export default router;