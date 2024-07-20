import { z } from "zod";


export const transactionSchema = z.object({
    description: z.string().min(2, {
        message: "Description must have at least 2 characters.",
    }).optional(),
    amount: z.number().positive(),
    date: z.date({
        message: "date is required.",
    }),
    category: z.string().nonempty({
        message: "Category is required.",
    })
});
