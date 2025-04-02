import {z} from 'zod'

export const CategorySchema = z.object({
    userId: z.string().min(6, {message: "User ID must be at least 6 characters long"}),
    name: z.string().min(2, {message: "Name must be at least 2 characters long"}),
    color: z.string().min(3, {message: "Color must be at least 3 characters long"}),
  });

export type CategorySchemaType = z.infer<typeof CategorySchema>