"use client"

import * as z from "zod";
import { RegisterSchema } from "@/schemas";

import { useForm } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { register } from "@/actions/register";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

export const RegisterForm = () => {

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        startTransition(async () => {
            register(values).then((msg) => {
                console.log(msg);

                if (msg.error) {
                    toast.error(msg.error);
                    return;
                }

                toast.success(msg.success || "Registration successful");
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white/80 text-sm font-medium">
                        Full Name
                    </Label>

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="space-y-2">

                    <Label htmlFor="email" className="text-white/80 text-sm font-medium">
                        Email
                    </Label>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-white/80 text-sm font-medium">
                            Password
                        </Label>
                        <Link href="/auth/forgot-password" className="text-white/60 hover:text-white/80 text-sm transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className="bg-zinc-800/50 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-white/20 h-12 rounded-xl"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                </div>

                <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-xl font-medium transition-all duration-200"
                >
                    Create Account →
                </Button>
            </form>

        </Form>
    )
  
}