import express, {Request, Response} from 'express'
import { register } from '../controllers/auth.controller'


const router = express.Router()

router.post('/register', (req, res) => register(req, res));

export default router