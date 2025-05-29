import { Request, Response, RequestHandler} from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const prisma = new PrismaClient();

// Function to transform 

// User register
export const register = async ( req: Request, res: Response ):  Promise<void> => {
    try {
        const { email, password, name, birthDate } = req.body;

        // 1. Check if the e-mail is already registered
        const emailExists = await prisma.usuario.findUnique({ where: { email } });
        if (emailExists) {
            res.status(409).json({ erro: "Email já cadastrado!" });
            return;
        }

        // 2. Encrypting user password 
        const encryptPass = await bcrypt.hash(password, 10);

        // 3. Save in the database
        const user = await prisma.usuario.create ( { 
            data: { email, nome: name, senha: encryptPass, data_nascimento: new Date(birthDate) }
        });
        
        // 4. Create JWT token
        const token = jwt.sign({ id: user.id }, 'SECRET', { expiresIn: '1h' });

        res.status(200).json({ user, token })

    } catch (err) {
        res.status(500).json({ error: "Registration error", err})
    }

}

