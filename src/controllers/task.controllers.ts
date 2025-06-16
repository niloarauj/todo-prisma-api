import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ZodError, number, z } from 'zod';
import { taskSchema } from "../schemas/auth.schema";

const prisma = new PrismaClient();

// Create a task
export const createTask = async ( req: Request, res: Response ): Promise<void> => {
    try {
        // Validate task infos
        const validateTaskInfos = taskSchema.parse(req.body)
        const { titulo, descricao, id } = validateTaskInfos

        // Check if user exists
        const userExists = await prisma.usuario.findUnique({
            where: { id },
        });

        if (!userExists) {
            res.status(404).json({ error: "User not found"})
            return
        }

        // Create the task record
        const newTask = await prisma.tarefa.create({
            data: {
                titulo, 
                descricao,
                id_usuario: id
            },
            include: {
                usuario: {
                    select: {
                    id: true,
                    nome: true,
                    email: true
                    }
                }
            }
        })

        res.status(201).json(newTask)
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ errors: err.errors })
        }
        res.status(500).json({ error: 'Error when creating tasks' })
    }
}

// Update Task
export const updateTask = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { id } = req.params;
        const { titulo, descricao, status } = req.body;

        const updateData: {
            titulo?: string;
            descricao?: string;
            status?: string;
            data_termino?: Date | null;
        } = { titulo, descricao, status };

        if (status === "CONCLUÍDA") {

            const currentTask = await prisma.tarefa.findUnique({
                where: {id: Number(id)},
                select: {status: true}
            });

            if (currentTask?.status !== "CONCLUÍDA"){
                updateData.data_termino = new Date()
            }
        } else if (status && status !== "CONCLUÍDA") {
            updateData.data_termino = null
        }

        // Check if the task exists and belongs to the user
        const updatedTask = await prisma.tarefa.update({
        where: { id: Number(id) },
        data: updateData
        });

        res.json(updatedTask);
    } catch (err) {
        
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
    }
}