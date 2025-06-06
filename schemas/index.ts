import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Enter a valid email address."
    }),
    password: z.string().min(1, {
        message: "Enter a valid password."
    })
})


export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Enter a valid email address."
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long."
    }),
    name: z.string().min(1, {
        message: "Enter your full name."
    })
})
