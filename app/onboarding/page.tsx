import React from "react";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/helper/session";
import {getUserById} from "@/data/user";
import OnboardingPage from "@/app/onboarding/client";


export const metadata = {
    title: "Products",
};


export default async function Page() {
    const session = await getCurrentUser();
    const user = await getUserById(session?.id!);

    if (!user) {
        return notFound();
    }

    return <OnboardingPage />;
}
