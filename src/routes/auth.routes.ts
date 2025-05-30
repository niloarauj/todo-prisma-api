import express, {Request, Response} from 'express'
import { register, login } from '../controllers/auth.controller'


const router = express.Router()

router.post('/register', (req, res) => register(req, res));
router.post('/login', (req, res) => login(req, res));

export default router