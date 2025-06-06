"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import {getUserByEmail} from "@/data/user";
import { signIn } from "@/lib/auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email)

    if(existingUser) {
        return { error: "Email already exists" };
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            onboarding: true,
        }
    });

    await signIn("credentials", {
        email,
        password,
        redirectTo: "/onboarding"
    })

    return { success: "Successfully registered!" };
}