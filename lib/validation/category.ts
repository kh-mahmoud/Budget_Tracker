import { z } from "zod";



export const categorySchema = z.object({
    name: z.string().min(3, {
        message: "name must have at least 3 characters",
    }).nonempty({
        message: "name is required",
    }),
    icon: z.string().max(20).nonempty(),
})