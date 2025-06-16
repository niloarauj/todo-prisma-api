import { z } from 'zod';

// Register validation
export const registerSchema = z.object({
    name: z.string().min(3, "Name too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "The password must to have 8 or more characteres long"),
    birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .refine(val => !isNaN(new Date(val).getTime()), "Invalid date")
})

// Login validation
export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "The password must to have 8 or more characteres long")
})

// Task creation validation
export const taskSchema = z.object({
    titulo: z.string().min(3, "Title too short"),
    descricao: z.string().optional(),
    id: z.number().int()
})




export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;