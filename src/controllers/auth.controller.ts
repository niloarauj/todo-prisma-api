import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { ZodError, z } from 'zod';

const prisma = new PrismaClient();


// User register
export const register = async ( req: Request, res: Response ):  Promise<void> => {
    try {
        // 1. Validate data register
        const validateRegister = registerSchema.parse(req.body)
        const { email, password, name, birthDate } = validateRegister

        // 2. Check if email exists
        const existingUser = await prisma.usuario.findUnique({
            where: { email },
            select: { id: true }
        });

        if (existingUser) {
            res.status(409).json({ error: "Email alredy registered" });
            return
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const newUser = await prisma.usuario.create({
            data: {
                email,
                nome: name, 
                senha: hashedPassword,
                data_nascimento: new Date(birthDate)
            },
            select: {
                id: true,
                email: true,
                nome: true, 
                data_nascimento: true,
            }
        }) 

        // 5. Generate a JWT 
        const token = jwt.sign({ 
            id: newUser.id },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }   
        )
        
        // 6. Respond 
        res.status(201).json({ 
        user: newUser,
        token
        });
    }
        catch(err) {
            // Handle Zod validation errors
            if (err instanceof ZodError) {
            res.status(400).json({
                error: "Validation error",
                details: err.errors.map(e => ({
                path: e.path.join('.'),
                message: e.message
                }))
            });
            return;
            }
            
            // Handle other errors
            console.error("Registration error:", err);
            res.status(500).json({ error: "Internal server error" });
        }
    }


export const login = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const validateLogin = loginSchema.parse(req.body)
        const { email, password } = validateLogin
        
        // 1. Check if the e-mail is already registered
        const userLogin = await prisma.usuario.findUnique({ 
            where: { email },
        });
        
        if (!userLogin) {
            res.status(409).json({ error: "Email not registered" });
            return;
        } 
        
        // 2. Verify the password 
        const verifyPassword = await bcrypt.compare(password, userLogin.senha);
        if (!verifyPassword) {
            res.status(401).json({ error: "Credentials are invalid" });
            return;
        }

        // 3. Create JWT token
        const token = jwt.sign(
            { id: userLogin.id }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '1h' })
        
        // 4. Return user info without password
        const { senha, ...userWithoutPassword } = userLogin; 
        res.status(200).json({ 
            userWithoutPassword, 
            token 
        });
        
    }
    catch (err) {
        // Handle Zod validation errors
        if (err instanceof z.ZodError) {
        res.status(400).json({
            error: "Validation error",
            details: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
            }))
        });
        return;
        }

        res.status(500).json({ error: "Registration error", err});
        return
    }         
}