import { z } from "zod";





export const projectSchema = z.object({
    title: z.string().min(3, {
        message: "Title must have at least 3 characters",
    }).nonempty({
        message: "Title is required",
    }),
    description: z.string().nullable(),
})